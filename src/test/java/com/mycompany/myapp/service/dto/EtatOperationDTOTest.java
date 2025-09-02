package com.mycompany.myapp.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class EtatOperationDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(EtatOperationDTO.class);
        EtatOperationDTO etatOperationDTO1 = new EtatOperationDTO();
        etatOperationDTO1.setId(1L);
        EtatOperationDTO etatOperationDTO2 = new EtatOperationDTO();
        assertThat(etatOperationDTO1).isNotEqualTo(etatOperationDTO2);
        etatOperationDTO2.setId(etatOperationDTO1.getId());
        assertThat(etatOperationDTO1).isEqualTo(etatOperationDTO2);
        etatOperationDTO2.setId(2L);
        assertThat(etatOperationDTO1).isNotEqualTo(etatOperationDTO2);
        etatOperationDTO1.setId(null);
        assertThat(etatOperationDTO1).isNotEqualTo(etatOperationDTO2);
    }
}
