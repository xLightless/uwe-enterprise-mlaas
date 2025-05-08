ALTER TABLE public."UserClaims" 
ADD COLUMN model_id INTEGER;

ALTER TABLE public."UserClaims"
ADD CONSTRAINT fk_model_id FOREIGN KEY (model_id) REFERENCES public."Models"(model_id);