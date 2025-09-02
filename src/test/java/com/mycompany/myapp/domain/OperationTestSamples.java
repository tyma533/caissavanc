package com.mycompany.myapp.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class OperationTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Operation getOperationSample1() {
        return new Operation().id(1L).numero("numero1").commentaire("commentaire1").montant(1L).utiCree(1L).utiModifie(1L);
    }

    public static Operation getOperationSample2() {
        return new Operation().id(2L).numero("numero2").commentaire("commentaire2").montant(2L).utiCree(2L).utiModifie(2L);
    }

    public static Operation getOperationRandomSampleGenerator() {
        return new Operation()
            .id(longCount.incrementAndGet())
            .numero(UUID.randomUUID().toString())
            .commentaire(UUID.randomUUID().toString())
            .montant(longCount.incrementAndGet())
            .utiCree(longCount.incrementAndGet())
            .utiModifie(longCount.incrementAndGet());
    }
}
