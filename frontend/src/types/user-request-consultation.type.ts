import {RequestTypeEnum} from "./request-type.enum";

export type UserRequestConsultationType = {
  name: string,
  phone: string,
  type: RequestTypeEnum
}
