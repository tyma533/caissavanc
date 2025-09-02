package com.mycompany.myapp.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class ControleTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Controle getControleSample1() {
        return new Controle().id(1L).observation("observation1").utiCree(1L).utiModifie(1L);
    }

    public static Controle getControleSample2() {
        return new Controle().id(2L).observation("observation2").utiCree(2L).utiModifie(2L);
    }

    public static Controle getControleRandomSampleGenerator() {
        return new Controle()
            .id(longCount.incrementAndGet())
            .observation(UUID.randomUUID().toString())
            .utiCree(longCount.incrementAndGet())
            .utiModifie(longCount.incrementAndGet());
    }
}
