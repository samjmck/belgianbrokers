var loaded_auto_advanced = 0;
jQuery(document).ready(function() {
	
	if( jQuery("#toplevel_page_gf_edit_forms .auto-advance-for-gravity-forms.pricing.upgrade-mode").length > 0) {
		jQuery("#toplevel_page_gf_edit_forms .auto-advance-for-gravity-forms.pricing.upgrade-mode").parent().attr("href", "https://multipagepro.com/").attr("target", "_blank");
	}
	
});

jQuery(document).bind('gform_page_loaded', function(event, form_id, current_page){ 			
	/*bind_advanced_events("Loaded");
	perform_hiding_operations();*/
});
jQuery(document).bind('gform_post_render', function(){ 
	bind_advanced_events("Post Render");
	perform_hiding_operations();
});

function perform_hiding_operations() {
	
	if( jQuery(".gform_page").length > 0 ) {		
		jQuery(".gform_page").each(function() {						
			if( jQuery(this).find(".hide-next-button").length > 0 ) {	
				jQuery(this).find(".gform_next_button").removeClass('make_visible');
				jQuery(this).find(".gform_next_button").addClass('keep_hidden');				
			}
			else {
				jQuery(this).find(".gform_next_button").removeClass('keep_hidden');	
			}
			
			if( jQuery(this).find(".hide-previous-button").length > 0 ) {				
				jQuery(this).find(".gform_previous_button").removeClass('make_visible');				
				jQuery(this).find(".gform_previous_button").addClass('keep_hidden');				
			}
			else {
				jQuery(this).find(".gform_previous_button").removeClass('keep_hidden');	
				jQuery(this).find(".gform_previous_button").addClass('make_visible');	
			}
			
			if( jQuery(this).find(".hide-submit-button").length > 0 ) {				
				jQuery(this).find(".gform_button").removeClass('make_visible');				
				jQuery(this).find(".gform_button").addClass('keep_hidden');				
			}
			else {
				jQuery(this).find(".gform_button").removeClass('keep_hidden');	
				jQuery(this).find(".gform_button").addClass('make_visible');	
			}
		});
	}
	
	if( jQuery(".gform_wrapper").length > 0 && ! jQuery(".gform_page").length > 0 ){	
	
		jQuery(".gform_wrapper").each(function() {									
			if( jQuery(this).find(".hide-submit-button").length > 0 ) {				
				jQuery(this).find(".gform_button").removeClass('make_visible');				
				jQuery(this).find(".gform_button").addClass('keep_hidden');				
			}
			else {
				jQuery(this).find(".gform_button").removeClass('keep_hidden');	
				jQuery(this).find(".gform_button").addClass('make_visible');	
			}
		});
		
	}
}

function bind_advanced_events(evt) {
	
	var click_perform = true;
	
	jQuery(".trigger-next-zzd input[type='radio']").click(function() {
	   var $this = jQuery(this);
	   setTimeout(function() {
		   
			if(click_perform) {
				$this.trigger("change");
			}
			click_perform - true;
	   }, 100);
	   
   });
   jQuery(".trigger-next-zzd input[type='radio'], .trigger-next-zzd select").change(function() {
		var process = true;
		var buttonshow = false;
		var $this = jQuery(this);
		
		click_perform = false;
		
		if( typeof lookup_fields == "function" ) {
			lookup = lookup_fields($this);
			process = lookup.process;
			buttonshow = lookup.buttonshow;
		}
		
		console.log(typeof lookup_fields);
		if(process) {
			jQuery(this).parents("form").trigger("submit", [true]);
		}
		
		if( buttonshow ) {
			var parents;
			if( jQuery(this).parents(".gform_page").length > 0 ) {
				parents = jQuery(this).parents(".gform_page");				
			}
			else {
				parents = jQuery(this).parents(".gform_wrapper");			
			}
			
			if(parents.find(".gform_next_button").length > 0) {
				parents.find(".gform_next_button").removeClass("keep_hidden");
			}
			else if(parents.find("input[type='submit']").length > 0) {
				parents.find("input[type='submit']").removeClass("keep_hidden");
			}
		}
		else {
			perform_hiding_operations();
		}
   });
			
}












