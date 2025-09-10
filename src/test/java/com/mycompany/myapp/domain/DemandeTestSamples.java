package com.mycompany.myapp.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class DemandeTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2L * Integer.MAX_VALUE));

    public static Demande getDemandeSample1() {
        Demande demande = new Demande();
        demande.setId(1L);
        demande.setMotif("motif1");
        demande.setUtiCree(1L);
        demande.setUtiModifie(1L);
        return demande;
    }

    public static Demande getDemandeSample2() {
        Demande demande = new Demande();
        demande.setId(2L);
        demande.setMotif("motif2");
        demande.setUtiCree(2L);
        demande.setUtiModifie(2L);
        return demande;
    }

    public static Demande getDemandeRandomSampleGenerator() {
        Demande demande = new Demande();
        demande.setId(longCount.incrementAndGet());
        demande.setMotif(UUID.randomUUID().toString());
        demande.setUtiCree(longCount.incrementAndGet());
        demande.setUtiModifie(longCount.incrementAndGet());
        return demande;
    }
}
