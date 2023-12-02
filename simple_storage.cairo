#[contract]
mod simple_storage {

    struct Storage {
        n: u32,
    }

    #[constructor]
    fn init(num: u32) {
        n::write(num);
    }

    #[view]
    fn store(num: u32) {
        n::write(num);
    }

    #[external]
    fn retrieve() -> u32 {
        let num = n::read();
        num
    }



}