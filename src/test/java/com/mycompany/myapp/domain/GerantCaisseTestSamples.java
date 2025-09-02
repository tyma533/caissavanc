package com.mycompany.myapp.domain;

import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;

public class GerantCaisseTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static GerantCaisse getGerantCaisseSample1() {
        return new GerantCaisse().id(1L).utiCree(1L).utiModifie(1L);
    }

    public static GerantCaisse getGerantCaisseSample2() {
        return new GerantCaisse().id(2L).utiCree(2L).utiModifie(2L);
    }

    public static GerantCaisse getGerantCaisseRandomSampleGenerator() {
        return new GerantCaisse()
            .id(longCount.incrementAndGet())
            .utiCree(longCount.incrementAndGet())
            .utiModifie(longCount.incrementAndGet());
    }
}
