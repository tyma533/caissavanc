package com.mycompany.myapp.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class PieceJustificatifTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static PieceJustificatif getPieceJustificatifSample1() {
        return new PieceJustificatif().id(1L).libelle("libelle1").utiCree(1L).utiModifie(1L);
    }

    public static PieceJustificatif getPieceJustificatifSample2() {
        return new PieceJustificatif().id(2L).libelle("libelle2").utiCree(2L).utiModifie(2L);
    }

    public static PieceJustificatif getPieceJustificatifRandomSampleGenerator() {
        return new PieceJustificatif()
            .id(longCount.incrementAndGet())
            .libelle(UUID.randomUUID().toString())
            .utiCree(longCount.incrementAndGet())
            .utiModifie(longCount.incrementAndGet());
    }
}
