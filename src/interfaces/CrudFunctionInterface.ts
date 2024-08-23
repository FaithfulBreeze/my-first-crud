import { IncomingMessage, ServerResponse} from 'node:http'

export interface CrudFunctionInterface {
    (req: IncomingMessage, res: ServerResponse) : void
}