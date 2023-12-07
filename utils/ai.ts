import { OpenAI } from 'langchain/llms/openai'
import { PromptTemplate } from 'langchain/prompts'
import { MemoryVectorStore } from 'langchain/vectorstores/memory'
import { OpenAIEmbeddings } from 'langchain/embeddings/openai'
import { loadQARefineChain} from 'langchain/chains'

import {
    StructuredOutputParser,
    OutputFixingParser,
  } from 'langchain/output_parsers'
  import { Document } from 'langchain/document'
  import { z } from 'zod'

const parser = StructuredOutputParser.fromZodSchema(
    z.object({
        mood: z.string().describe('the mood of the person who wrote the journal entry.'),
        subject: z.string().describe('the subject of the journal entry'),
        summary: z.string().describe('quick summary of the entire entry.'),
        burnout: z.boolean().describe('does the journal entry show indications of emotional burnout? Signs of burnout include lack of energy, constantly tired, irritable, etc.'),
        color: z.string().describe('a hexidecimal color code that represents the mood of the entry. Example #0101fe for blue representing happiness'),
    })
)

const getPrompt = async (content) => {
  const format_instructions = parser.getFormatInstructions()

  const prompt = new PromptTemplate({
    template:
      'Analyze the following journal entry. Follow the intrusctions and format your response to match the format instructions, no matter what! \n{format_instructions}\n{entry}',
    inputVariables: ['entry'],
    partialVariables: { format_instructions },
  })

  const input = await prompt.format({
    entry: content,
  })

  return input
}

export const analyzeEntry = async (entry) => {
  const input = await getPrompt(entry.content)
  const model = new OpenAI({ temperature: 0, modelName: 'gpt-3.5-turbo' })
  const output = await model.call(input)

  try {
    return parser.parse(output)
  } catch (e) {
    const fixParser = OutputFixingParser.fromLLM(
      new OpenAI({ temperature: 0, modelName: 'gpt-3.5-turbo' }),
      parser
    )
    const fix = await fixParser.parse(output)
    return fix
  }
}

export const qa = async (question, entries) => {
  const docs = entries.map(
    (entry) =>
      new Document({
        pageContent: entry.content,
        metadata: { source: entry.id, date: entry.createdAt },
      })
  )
  const model = new OpenAI({ temperature: 0, modelName: 'gpt-3.5-turbo' })
  const chain = loadQARefineChain(model)
  const embeddings = new OpenAIEmbeddings()
  const store = await MemoryVectorStore.fromDocuments(docs, embeddings)
  const relevantDocs = await store.similaritySearch(question)
  const res = await chain.call({
    input_documents: relevantDocs,
    question,
  })

  return res.output_text
}