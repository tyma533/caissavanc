package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.AgentEtatProfilTestSamples.*;
import static com.mycompany.myapp.domain.GerantTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class GerantTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Gerant.class);
        Gerant gerant1 = getGerantSample1();
        Gerant gerant2 = new Gerant();
        assertThat(gerant1).isNotEqualTo(gerant2);

        gerant2.setId(gerant1.getId());
        assertThat(gerant1).isEqualTo(gerant2);

        gerant2 = getGerantSample2();
        assertThat(gerant1).isNotEqualTo(gerant2);
    }

    @Test
    void agentEtatProfilTest() throws Exception {
        Gerant gerant = getGerantRandomSampleGenerator();
        AgentEtatProfil agentEtatProfilBack = getAgentEtatProfilRandomSampleGenerator();

        gerant.setAgentEtatProfil(agentEtatProfilBack);
        assertThat(gerant.getAgentEtatProfil()).isEqualTo(agentEtatProfilBack);

        gerant.agentEtatProfil(null);
        assertThat(gerant.getAgentEtatProfil()).isNull();
    }
}
