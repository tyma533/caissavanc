package com.mycompany.myapp.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class AgentTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Agent getAgentSample1() {
        return new Agent()
            .id(1L)
            .codeMatrile("codeMatrile1")
            .cni("cni1")
            .statutAgent("statutAgent1")
            .nom("nom1")
            .prenom("prenom1")
            .sexe("sexe1")
            .emailUcad("emailUcad1")
            .telephone("telephone1")
            .fonctionAgent("fonctionAgent1")
            .typePersonnel("typePersonnel1")
            .lieuNaissance("lieuNaissance1")
            .nationalite("nationalite1")
            .email("email1")
            .adresse("adresse1")
            .role("role1")
            .modifiedBy("modifiedBy1")
            .createdBy("createdBy1");
    }

    public static Agent getAgentSample2() {
        return new Agent()
            .id(2L)
            .codeMatrile("codeMatrile2")
            .cni("cni2")
            .statutAgent("statutAgent2")
            .nom("nom2")
            .prenom("prenom2")
            .sexe("sexe2")
            .emailUcad("emailUcad2")
            .telephone("telephone2")
            .fonctionAgent("fonctionAgent2")
            .typePersonnel("typePersonnel2")
            .lieuNaissance("lieuNaissance2")
            .nationalite("nationalite2")
            .email("email2")
            .adresse("adresse2")
            .role("role2")
            .modifiedBy("modifiedBy2")
            .createdBy("createdBy2");
    }

    public static Agent getAgentRandomSampleGenerator() {
        return new Agent()
            .id(longCount.incrementAndGet())
            .codeMatrile(UUID.randomUUID().toString())
            .cni(UUID.randomUUID().toString())
            .statutAgent(UUID.randomUUID().toString())
            .nom(UUID.randomUUID().toString())
            .prenom(UUID.randomUUID().toString())
            .sexe(UUID.randomUUID().toString())
            .emailUcad(UUID.randomUUID().toString())
            .telephone(UUID.randomUUID().toString())
            .fonctionAgent(UUID.randomUUID().toString())
            .typePersonnel(UUID.randomUUID().toString())
            .lieuNaissance(UUID.randomUUID().toString())
            .nationalite(UUID.randomUUID().toString())
            .email(UUID.randomUUID().toString())
            .adresse(UUID.randomUUID().toString())
            .role(UUID.randomUUID().toString())
            .modifiedBy(UUID.randomUUID().toString())
            .createdBy(UUID.randomUUID().toString());
    }
}
