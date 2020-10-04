export async function sequence(a, b) {
  await a();
  await b();
}

export async function parallel(a, b) {
  await Promise.all([a, b]);
}
