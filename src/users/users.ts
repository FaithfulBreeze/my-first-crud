import fs from 'fs'
import path from 'path'
import { UserInterface } from '../interfaces/UserInterface'

export const users = (): (Array<UserInterface> | void) => {
    try {
        const buffer = fs.readFileSync(path.join(__dirname, 'userDatabase.json'))
        return JSON.parse(buffer.toString())
    } catch (error) {
        console.log(error)
    }
}
