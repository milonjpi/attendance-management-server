export type IUserInfo = {
  IndexKey: bigint;
  ID: string;
  Name?: string;
  GroupID?: number;
  EmployeeNum?: string;
  Department?: string;
  Description?: string;
  Privilege?: number;
  AuthType?: number;
  regDate?: Date;
  expDate?: Date;
  Password?: string;
  RFID?: bigint;
  tzCode?: number;
  statusAPB?: number;
  TemplateCnt?: number;
  SvrRecordTime?: Date;
  Position?: number;
  EMail?: string;
  LastPWTime?: number;
  OptionVal?: number;
  FaceCount?: number;
  PhoneNo?: string;
  IssueCount?: number;
  StoreCode?: number;
  VendorCode?: number;
  VoIPuse?: number;
  DoorOpen1?: number;
  DoorOpen2?: number;
  Number?: string;
};

export type ITerminal = {
  ID: number;
  Name: string;
};

export type ITerminalUser = {
  UserIDIndex: bigint;
  TerminalID: number;
  UserID: string;
};
