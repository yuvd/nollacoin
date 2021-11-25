const NollaCoin = artifacts.require("NollaCoin");

let instance;

beforeEach(async function() {
    instance = await NollaCoin.deployed();
})

contract('NollaCoin', (accounts) => {
    it("should have 20 decimals", async () => {
        const decimals = await instance.decimals();

        assert.equal(decimals, 20)
    });

  it(`should put ${1000*10**20} NollaCoin in the first account`, async () => {
    const balance = await instance.balanceOf.call(accounts[0]);

    assert.equal(balance.valueOf().toString(), 1000*10**20);
  });
});
