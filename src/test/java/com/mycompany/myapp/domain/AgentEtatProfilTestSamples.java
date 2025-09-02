package com.mycompany.myapp.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class AgentEtatProfilTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static AgentEtatProfil getAgentEtatProfilSample1() {
        return new AgentEtatProfil().id(1L).profil("profil1").modifiedBy("modifiedBy1").createdBy("createdBy1");
    }

    public static AgentEtatProfil getAgentEtatProfilSample2() {
        return new AgentEtatProfil().id(2L).profil("profil2").modifiedBy("modifiedBy2").createdBy("createdBy2");
    }

    public static AgentEtatProfil getAgentEtatProfilRandomSampleGenerator() {
        return new AgentEtatProfil()
            .id(longCount.incrementAndGet())
            .profil(UUID.randomUUID().toString())
            .modifiedBy(UUID.randomUUID().toString())
            .createdBy(UUID.randomUUID().toString());
    }
}
