import { Page } from "@playwright/test";

export function generateUser() {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);

  return {
    firstName: 'New',
    lastName:  'Bee',
    address:   'Georgestrasse 1',
    city:      'Berlin',
    state:     'Berlin',
    zipCode:   '10115',
    phone:     '01234567890',
    ssn:       '123-45-6789',
    username: `huji_${Date.now()}_${Math.random().toString(36).substring(2,8)}`,
    password:  'Bee@1235',
  };
}

export async function registerAndLogin(page:Page, user: ReturnType<typeof generateUser>) {
  await page.goto('/parabank/register.htm');

  await page.fill('#customer\\.firstName', user.firstName);
  await page.fill('#customer\\.lastName', user.lastName);
  await page.fill('#customer\\.address\\.street', user.address);
  await page.fill('#customer\\.address\\.city', user.city);
  await page.fill('#customer\\.address\\.state', user.state);
  await page.fill('#customer\\.address\\.zipCode', user.zipCode);
  await page.fill('#customer\\.phoneNumber', user.phone);
  await page.fill('#customer\\.ssn', user.ssn);
  await page.fill('#customer\\.username', user.username);
  await page.fill('#customer\\.password', user.password);
  await page.fill('#repeatedPassword', user.password);
  await page.click('input[value="Register"]');

 
  
}