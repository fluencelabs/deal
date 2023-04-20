import { createPATE } from './pate'
import { createdDealProof } from './dealCreated'

enum Command {
  CreatePATEProof = 'create-pate-proof',
  CreatedDealProof = 'created-deal-proof',
}

const arg = process.argv.slice(2)

switch (arg[0] as Command) {
  case Command.CreatePATEProof:
    createPATE(arg[1], arg[2])
    break
  case Command.CreatedDealProof:
    createdDealProof(arg[1], arg[2])
    break
}
