import {RequestTypeEnum} from "./request-type.enum";

export type UserRequestOrderType = {
  name: string,
  phone: string,
  service: string,
  type: RequestTypeEnum
}
