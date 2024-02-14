async function main() {
    const { fizzBuzzFor } = await import ('./BuzzLightyear.mjs')
    fizzBuzzFor(100);
}

main();