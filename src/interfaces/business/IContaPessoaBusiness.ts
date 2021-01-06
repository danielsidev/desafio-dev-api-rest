import { IContaBasicBusiness } from "./IContaBasicBusiness";
import { IContaBusiness } from "./IContaBusiness";
import { IPessoaBusiness } from "./IPessoaBusiness";

export interface IContaPessoaBusiness extends IPessoaBusiness, IContaBasicBusiness{

}