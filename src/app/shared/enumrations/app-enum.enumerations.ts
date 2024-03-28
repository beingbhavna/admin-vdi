export enum HandelError {
  ShowAndReturn = 1,
  ShowAndKill = 2,
  HideAndReturn = 3,
  HideAndKill = 4,
}
export enum FuncStatus {
  True = 1,
  False = 2,
  Error = 3,
}

// export enum Changepassword {
//   changePassword = 'changePassword',
// }

// export enum PathSelector {
//   getFileSystemDrivesList = 'getfilesystemdriveslist',
//   getUserRootFilesList = 'getuserrootfileslist',
//   createLocalDirectory = 'createlocaldirectory',
//   saveRootDirectory = 'saverootdirectory',
//   getPrinters = 'getprinters',
//   getSelectedPrinters = 'getselectedprinters',
//   updateSelectedPrinters = 'updateselectedprinters',
// }

export enum Generatekey {
  generateKey = 'generateKey',
  downloadKey = 'downloadKey',
  checkKeys = 'checkKeys',
  saveKey = 'saveKey',
  updateKey = 'updateKey',
  restoreKeys = 'restoreKeys',
}
export enum Security {
  saveEditedOrgsUser = 'saveEditedOrgsUser',
  getUserDataByUserId = 'getUserDataByUserId',
}

export enum Server {
  getServerList = 'getServerList',
  addServerList = 'addServerList',
  updateServer = 'updateServer',
  deleteServer = 'deleteServer',
  getServerListById = 'getServerListById',
  getServerWiseFilterList = 'getServerWiseFilterList',
}
export enum Vdi {
  getVdiList = 'getVdiList',
  addVdiDetails = 'addVdiDetails',
  getVdiListById = 'getVdiListById',
  updateVdi = 'updateVdi',
  getVdiWiseFilterList = 'getVdiWiseFilterList',
  getServerWiseFilterList = 'getServerWiseFilterList',
  reset2FA = 'reset2FA',
  disableVdi = 'disableVdi',
}
