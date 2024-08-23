import { IncomingMessage, ServerResponse} from 'node:http'

export interface SourceFunctionInterface {
    (req: IncomingMessage, res: ServerResponse, file?: string) : void
}