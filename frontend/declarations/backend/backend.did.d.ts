import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Category { 'icon' : string, 'name' : string }
export interface Task {
  'id' : bigint,
  'completedAt' : [] | [Time],
  'completed' : boolean,
  'description' : string,
  'category' : string,
}
export type Time = bigint;
export interface _SERVICE {
  'addTask' : ActorMethod<[string, string], bigint>,
  'completeTask' : ActorMethod<[bigint], boolean>,
  'deleteTask' : ActorMethod<[bigint], boolean>,
  'getCategories' : ActorMethod<[], Array<Category>>,
  'getDefaultCategories' : ActorMethod<[], Array<Category>>,
  'getTasks' : ActorMethod<[], Array<Task>>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
