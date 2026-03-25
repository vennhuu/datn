package com.example.datn.Controller;

import java.io.IOException;
import java.net.URISyntaxException;
import java.time.Instant;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.datn.Domain.response.upload.ResFileUploadDTO;
import com.example.datn.Service.FileService;
import com.example.datn.Utils.annotation.APIMessage;
import com.example.datn.Utils.errors.InvalidException;


@RestController
@RequestMapping("/api/v1")
public class FileUploadController {

    @Value("${venn.upload-file.base-uri}")
    private String baseURI ;

    private final FileService fileService ;

    public FileUploadController(FileService fileService) {
        this.fileService = fileService;
    }

    @PostMapping("/files")
    @APIMessage("Upload file")
    public ResponseEntity<ResFileUploadDTO> uploadFile(
        @RequestParam("file") MultipartFile file , 
        @RequestParam("folder") String folder
    ) throws URISyntaxException, IOException, InvalidException {

        // validation
        if( file == null || file.isEmpty()) {
            throw new InvalidException("File trống vui lòng tải file lên") ;
        }

        String fileName = file.getOriginalFilename();
        List<String> allowedExtensions = Arrays.asList("pdf", "jpg", "jpeg", "png", "doc", "docx"); 
        boolean isValid = allowedExtensions.stream().anyMatch(items -> fileName.toLowerCase().endsWith(items)) ;

        if (!isValid) {
            throw new InvalidException("Chỉ chấp nhận file " + allowedExtensions.toString()) ;
        }
        
        // create folder if not exists
        this.fileService.createUploadFile(baseURI + folder);

        // store avt
        String uploadFile = this.fileService.store(file, folder);

        ResFileUploadDTO res = new ResFileUploadDTO(uploadFile, Instant.now()) ;
        return ResponseEntity.status(HttpStatus.CREATED).body(res);
    }
    
}
