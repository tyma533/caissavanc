package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.AgentEtatProfilTestSamples.*;
import static com.mycompany.myapp.domain.AgentTestSamples.*;
import static com.mycompany.myapp.domain.EtablissementTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class AgentEtatProfilTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(AgentEtatProfil.class);
        AgentEtatProfil agentEtatProfil1 = getAgentEtatProfilSample1();
        AgentEtatProfil agentEtatProfil2 = new AgentEtatProfil();
        assertThat(agentEtatProfil1).isNotEqualTo(agentEtatProfil2);

        agentEtatProfil2.setId(agentEtatProfil1.getId());
        assertThat(agentEtatProfil1).isEqualTo(agentEtatProfil2);

        agentEtatProfil2 = getAgentEtatProfilSample2();
        assertThat(agentEtatProfil1).isNotEqualTo(agentEtatProfil2);
    }

    @Test
    void agentTest() throws Exception {
        AgentEtatProfil agentEtatProfil = getAgentEtatProfilRandomSampleGenerator();
        Agent agentBack = getAgentRandomSampleGenerator();

        agentEtatProfil.setAgent(agentBack);
        assertThat(agentEtatProfil.getAgent()).isEqualTo(agentBack);

        agentEtatProfil.agent(null);
        assertThat(agentEtatProfil.getAgent()).isNull();
    }

    @Test
    void etablissementTest() throws Exception {
        AgentEtatProfil agentEtatProfil = getAgentEtatProfilRandomSampleGenerator();
        Etablissement etablissementBack = getEtablissementRandomSampleGenerator();

        agentEtatProfil.setEtablissement(etablissementBack);
        assertThat(agentEtatProfil.getEtablissement()).isEqualTo(etablissementBack);

        agentEtatProfil.etablissement(null);
        assertThat(agentEtatProfil.getEtablissement()).isNull();
    }
}
