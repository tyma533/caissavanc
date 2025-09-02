package com.mycompany.myapp.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class AgentEtatProfilDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(AgentEtatProfilDTO.class);
        AgentEtatProfilDTO agentEtatProfilDTO1 = new AgentEtatProfilDTO();
        agentEtatProfilDTO1.setId(1L);
        AgentEtatProfilDTO agentEtatProfilDTO2 = new AgentEtatProfilDTO();
        assertThat(agentEtatProfilDTO1).isNotEqualTo(agentEtatProfilDTO2);
        agentEtatProfilDTO2.setId(agentEtatProfilDTO1.getId());
        assertThat(agentEtatProfilDTO1).isEqualTo(agentEtatProfilDTO2);
        agentEtatProfilDTO2.setId(2L);
        assertThat(agentEtatProfilDTO1).isNotEqualTo(agentEtatProfilDTO2);
        agentEtatProfilDTO1.setId(null);
        assertThat(agentEtatProfilDTO1).isNotEqualTo(agentEtatProfilDTO2);
    }
}
