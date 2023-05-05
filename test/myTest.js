contract("TirelireCrypto", (accounts) => {
    let tirelire;
  
    beforeEach(async () => {
      tirelire = await TirelireCrypto.new({ from: accounts[0] });
    });
  
    it("devrait permettre à un utilisateur de déposer de l'argent", async () => {
      const montant = web3.utils.toWei("1", "ether");
      await tirelire.deposit({ from: accounts[1], value: montant });
      const soldeUtilisateur = await tirelire.soldeUtilisateur(accounts[1]);
      assert.equal(soldeUtilisateur.toString(), montant.toString(), "Le solde utilisateur n'a pas été mis à jour correctement");
    });
  
    it("devrait permettre à un utilisateur de retirer de l'argent après 24 heures", async () => {
      const montant = web3.utils.toWei("1", "ether");
      await tirelire.deposit({ from: accounts[1], value: montant });
      await time.increase(time.duration.hours(24));
      const balanceAvantRetrait = await web3.eth.getBalance(accounts[1]);
      await tirelire.withdraw({ from: accounts[1] });
      const balanceAprèsRetrait = await web3.eth.getBalance(accounts[1]);
      const soldeUtilisateur = await tirelire.soldeUtilisateur(accounts[1]);
      assert.equal(balanceAprèsRetrait.toString(), balanceAvantRetrait.add(montant).toString(), "Le montant retiré est incorrect");
      assert.equal(soldeUtilisateur.toString(), "0", "Le solde utilisateur n'a pas été mis à jour correctement");
    });
  
    it("devrait pénaliser un utilisateur qui retire avant 24 heures", async () => {
      const montant = web3.utils.toWei("1", "ether");
      await tirelire.deposit({ from: accounts[1], value: montant });
      const balanceAvantRetrait = await web3.eth.getBalance(accounts[1]);
      try {
        await tirelire.withdraw({ from: accounts[1] });
      } catch (error) {
        assert(error.toString().includes("Vous ne pouvez pas retirer avant 24 heures"), "Erreur inattendue : " + error.toString());
        return;
      }
      const balanceAprèsRetrait = await web3.eth.getBalance(accounts[1]);
      const penalite = montant * 0.2;
      assert.equal(balanceAprèsRetrait.toString(), balanceAvantRetrait.add(montant - penalite).toString(), "Le montant retiré est incorrect");
    });
  });
  