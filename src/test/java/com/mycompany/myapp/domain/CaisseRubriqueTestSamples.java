package com.mycompany.myapp.domain;

import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;

public class CaisseRubriqueTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static CaisseRubrique getCaisseRubriqueSample1() {
        return new CaisseRubrique().id(1L).utiCree(1L).utiModifie(1L);
    }

    public static CaisseRubrique getCaisseRubriqueSample2() {
        return new CaisseRubrique().id(2L).utiCree(2L).utiModifie(2L);
    }

    public static CaisseRubrique getCaisseRubriqueRandomSampleGenerator() {
        return new CaisseRubrique()
            .id(longCount.incrementAndGet())
            .utiCree(longCount.incrementAndGet())
            .utiModifie(longCount.incrementAndGet());
    }
}
