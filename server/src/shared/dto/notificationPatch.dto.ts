export interface NotificationPatch {
  _index: number;
  option: 'READ'|'IMPORTANT'|'REMIND';
}