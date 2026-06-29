import { readFile, writeFile } from "fs/promises";
import { join } from "path";
import type { Contact } from "@/types/contact";

const DB_PATH = join(process.cwd(), "mock-db", "contacts.json");

const SCENARIO_CONTACTS: Omit<Contact, "userId">[] = [
  { id: "scenario-error",   name: "Juan Error",    email: "juan.error@mock.local" },
  { id: "scenario-timeout", name: "Edén TimeOut",  email: "eden.timeout@mock.local" },
  { id: "scenario-unknown", name: "Max Unknown",   email: "max.unknown@mock.local" },
];

async function readContacts(): Promise<Contact[]> {
  const content = await readFile(DB_PATH, "utf-8");
  return JSON.parse(content) as Contact[];
}

async function writeContacts(contacts: Contact[]): Promise<void> {
  await writeFile(DB_PATH, JSON.stringify(contacts, null, 2), "utf-8");
}

export async function getContactsByUserId(userId: string): Promise<Contact[]> {
  const contacts = await readContacts();
  const userContacts = contacts.filter((c) => c.userId === userId);
  const scenarios = SCENARIO_CONTACTS.map((c) => ({ ...c, userId }));
  return [...userContacts, ...scenarios];
}

export async function addContact(data: {
  userId: string;
  name: string;
  email?: string;
  phone?: string;
}): Promise<Contact> {
  const contacts = await readContacts();
  const contact: Contact = { id: `contact-${Date.now()}`, ...data };
  contacts.push(contact);
  await writeContacts(contacts);
  return contact;
}
