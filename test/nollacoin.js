const NollaCoin = artifacts.require("NollaCoin");

let instance;

beforeEach(async function () {
  instance = await NollaCoin.new(1000);
});

contract("NollaCoin", (accounts) => {
  describe("basic erc-20 tests", () => {
    it("should have 20 decimals", async () => {
      const decimals = await instance.decimals();

      assert.equal(decimals, 20);
    });

    it(`should put ${
      1000 * 10 ** 20
    } NollaCoin in the first account`, async () => {
      const balance = await instance.balanceOf.call(accounts[0]);

      assert.equal(balance.valueOf().toString(), 1000 * 10 ** 20);
    });

    it("should transfer 1000 NollaCoin wei from account 0 to account 1", async () => {
      let balance = await getBalance(instance, accounts[1]);
      assert.equal(balance, 0, "Starting balance is not 0");

      await instance.transfer(accounts[1], 1000, {from: accounts[0]});
      balance = await getBalance(instance, accounts[1]);

      assert.equal(balance, 1000, "Final balance is not 1000");
    });
  });

  describe("bark tests", () => {
    it("should fail if barker doesn't have enough wei to bark", async () => {
      try {
        let balance = await getBalance(instance, accounts[1]);
        assert.equal(balance, 0, "Starting balance is not 0");

        await bark(instance, accounts[1], accounts[0], 1);
      } catch (err) {
        assert.ok(
          err,
          "Barking is succeeding despite user not having enough wei"
        );
      }

      it("should add user to barkers list after barking", async () => {
        await bark(instance, accounts[0], accounts[1], 1);

        const barkersList = await instance.barkersList();

        assert.ok(barkersList[accounts[0]]);
      });

      try {
        const barksCost = await instance.barksCost();
        let balance = await getBalance(instance, accounts[0]);

        assert.isBelow(
          balance,
          barksCost * 9999999999,
          "User has enough wei to bark, test invalid"
        );

        await bark(instance, accounts[0], accounts[1], 9999999999);
      } catch (err) {
        assert.ok(
          err,
          "Barking is succeeding despite user not having enough wei"
        );
      }
    });

    it("should increase barks amount from accounts[0] at account[1] to 3", async () => {
      let barksOn1By0 = await instance.barksLedger(accounts[1], accounts[0]);
      assert.equal(barksOn1By0, 0, "Starting barks are not 0");

      barksOn1By0 = await bark(instance, accounts[0], accounts[1], 3);

      assert.equal(barksOn1By0, 3, "Final barks are not 3");
    });

    it("should accumulate barks from accounts[0] at account[1] when bark is called multiple times", async () => {
      let barksOn1By0 = await instance.barksLedger(accounts[1], accounts[0]);
      assert.equal(barksOn1By0, 0, "Starting barks are not 0");

      barksOn1By0 = await bark(instance, accounts[0], accounts[1], 2);
      assert.equal(barksOn1By0, 2, "Barks amount after initial bark is not 2");

      barksOn1By0 = await bark(instance, accounts[0], accounts[1], 3);
      assert.equal(barksOn1By0, 5, "Final barks amount is not 2 + 3 = 5");
    });

    it("should keep correct track of barks account[1] accumulated after being barked at by several users", async () => {
      // Give other accounts enough NC wei to bark
      await instance.transfer(accounts[2], 5000, {from: accounts[0]});
      await instance.transfer(accounts[3], 5000, {from: accounts[0]});

      await bark(instance, accounts[0], accounts[1], 2);
      let barksCount = await instance.userBarks(accounts[1]);
      assert.equal(
        barksCount,
        2,
        "After being barked at twice, user should have 2 barks accumulated"
      );

      await bark(instance, accounts[2], accounts[1], 3);
      barksCount = await instance.userBarks(accounts[1]);
      assert.equal(
        barksCount,
        5,
        "After being barked at an additional 3 times, user should have 5 barks accumulated"
      );

      await bark(instance, accounts[3], accounts[1], 4);
      barksCount = await instance.userBarks(accounts[1]);
      assert.equal(
        barksCount,
        9,
        "After being barked at an additional 4 times, user should have 9 barks accumulated"
      );
    });
  });
});

async function getBalance(instance, account) {
  let balance = await instance.balanceOf(account);
  balance = balance.valueOf().toString();

  return balance;
}

async function bark(instance, barker, barkee, amount) {
  await instance.bark(barkee, amount, {from: barker});
  const barksCount = await instance.barksLedger(barkee, barker);

  return barksCount.valueOf().toString();
}
