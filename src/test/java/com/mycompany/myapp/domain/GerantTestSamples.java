package com.mycompany.myapp.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class GerantTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Gerant getGerantSample1() {
        return new Gerant().id(1L).nom("nom1").utiCree(1L).utiModifie(1L);
    }

    public static Gerant getGerantSample2() {
        return new Gerant().id(2L).nom("nom2").utiCree(2L).utiModifie(2L);
    }

    public static Gerant getGerantRandomSampleGenerator() {
        return new Gerant()
            .id(longCount.incrementAndGet())
            .nom(UUID.randomUUID().toString())
            .utiCree(longCount.incrementAndGet())
            .utiModifie(longCount.incrementAndGet());
    }
}
