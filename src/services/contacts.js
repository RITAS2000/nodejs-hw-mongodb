import { ContactsCollection } from '../models/contact.js';

export async function getAllContacts() {
  const contacts = await ContactsCollection.find();

  return contacts;
}

export async function getContactById(contactId) {
  const contactById = await ContactsCollection.findById(contactId);
  return contactById;
}

export function createContact(payload) {
  return ContactsCollection.create(payload);
}

export function updateContact(contactId, payload) {
  return ContactsCollection.findByIdAndUpdate(contactId, payload, {
    new: true,
  });
}

export function deleteContact(studentId) {
  return ContactsCollection.findByIdAndDelete(studentId);
}
