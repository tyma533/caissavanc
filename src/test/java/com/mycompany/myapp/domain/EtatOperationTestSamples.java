package com.mycompany.myapp.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class EtatOperationTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static EtatOperation getEtatOperationSample1() {
        return new EtatOperation().id(1L).libelle("libelle1").utiCree(1L).utiModifie(1L);
    }

    public static EtatOperation getEtatOperationSample2() {
        return new EtatOperation().id(2L).libelle("libelle2").utiCree(2L).utiModifie(2L);
    }

    public static EtatOperation getEtatOperationRandomSampleGenerator() {
        return new EtatOperation()
            .id(longCount.incrementAndGet())
            .libelle(UUID.randomUUID().toString())
            .utiCree(longCount.incrementAndGet())
            .utiModifie(longCount.incrementAndGet());
    }
}
