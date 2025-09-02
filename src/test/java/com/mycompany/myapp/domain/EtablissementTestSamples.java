package com.mycompany.myapp.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class EtablissementTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Etablissement getEtablissementSample1() {
        return new Etablissement().id(1L).libelle("libelle1").sigle("sigle1").utiCree(1L).utiModifie(1L);
    }

    public static Etablissement getEtablissementSample2() {
        return new Etablissement().id(2L).libelle("libelle2").sigle("sigle2").utiCree(2L).utiModifie(2L);
    }

    public static Etablissement getEtablissementRandomSampleGenerator() {
        return new Etablissement()
            .id(longCount.incrementAndGet())
            .libelle(UUID.randomUUID().toString())
            .sigle(UUID.randomUUID().toString())
            .utiCree(longCount.incrementAndGet())
            .utiModifie(longCount.incrementAndGet());
    }
}
