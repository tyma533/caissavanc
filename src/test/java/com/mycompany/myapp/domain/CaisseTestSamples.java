package com.mycompany.myapp.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class CaisseTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Caisse getCaisseSample1() {
        return new Caisse().id(1L).libelle("libelle1").solde(1L).utiCree(1L).utiModifie(1L);
    }

    public static Caisse getCaisseSample2() {
        return new Caisse().id(2L).libelle("libelle2").solde(2L).utiCree(2L).utiModifie(2L);
    }

    public static Caisse getCaisseRandomSampleGenerator() {
        return new Caisse()
            .id(longCount.incrementAndGet())
            .libelle(UUID.randomUUID().toString())
            .solde(longCount.incrementAndGet())
            .utiCree(longCount.incrementAndGet())
            .utiModifie(longCount.incrementAndGet());
    }
}
