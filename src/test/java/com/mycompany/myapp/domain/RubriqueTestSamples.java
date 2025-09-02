package com.mycompany.myapp.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class RubriqueTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Rubrique getRubriqueSample1() {
        return new Rubrique().id(1L).libelle("libelle1").description("description1").code("code1").utiCree(1L).utiModifie(1L);
    }

    public static Rubrique getRubriqueSample2() {
        return new Rubrique().id(2L).libelle("libelle2").description("description2").code("code2").utiCree(2L).utiModifie(2L);
    }

    public static Rubrique getRubriqueRandomSampleGenerator() {
        return new Rubrique()
            .id(longCount.incrementAndGet())
            .libelle(UUID.randomUUID().toString())
            .description(UUID.randomUUID().toString())
            .code(UUID.randomUUID().toString())
            .utiCree(longCount.incrementAndGet())
            .utiModifie(longCount.incrementAndGet());
    }
}
