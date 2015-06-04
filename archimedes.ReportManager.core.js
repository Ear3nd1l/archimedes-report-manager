var ArchimedesReportManager = function(){
	
	// Defined private variables.
	var VARIABLES = {
		ReportType:			'DataGrid',
		ReportContainer:	'divReportContainer',
		DataTable:			'tblReportData',
		FormContainer:		'divFormContainer',
		JsonData:			'',
		TableWidth:			960,
		PostData:			{
			Parameters:		'',
			Limit:			25,
			Start:			1,
			Dir:			'ASC',
			Sort:			''
		}
	};
	
	// If the Report Container does not exist, we need to append it to the body of tha page.
	$(function(){

		if(!$('#' + VARIABLES.ReportContainer).length)
		{
			$('body').append('<div class="" style="width: ' + VARIABLES.TableWidth + 'px; margin: 0 auto;"><div id="' + VARIABLES.FormContainer + '"></div><div id="' + VARIABLES.ReportContainer + '" class="" style="width: ' + VARIABLES.TableWidth + 'px; overflow-x: auto;"></div></div>');
		}
	
	});
	
	/*
		ColumnModel
				This object stores and creates the column headings of the data grid.
	*/
	this.ColumnModel = function(options){
		
		// Set the default options
		var defaults = {
			id:			'',
			dataStore:	'',
			columns:	[
						 	{
								header:		'column1',
								dataIndex:	'column1'
							}
			]
		};
		
		// Overwrite default options with user provided ones and merge them into "options"
		var options = $.extend({}, defaults, options); 
		
		// We'll need this value in several places, so give it's value to the public variable.
		VARIABLES.ColumnDefinitions = options.columns;
		this.ColumnDefinitions = options.columns;
		
		/*
			DrawHeaders
					This function draws the headers on a data table.
		*/
		this.DrawHeaders = function(callback) {
		
			$.each(options.columns, function(i, objColumnData) {
				
				var strSortableClass = '';
				var strWidth = '';
				var strDataType = 'string';
				
				// Assign the default sort class.
				if(typeof objColumnData.sortable == 'undefined')
				{
					strSortableClass = 'rm-Data-SortableHeader';
				}
				
				// Set the width of the column
				if(typeof objColumnData.width != 'undefined')
				{
					strWidth = objColumnData.width;
				}
				
				// Set the datatype of the column
				if(typeof objColumnData.dataType != 'undefined')
				{
					strDataType = objColumnData.dataType;
				}
				
				// Add the width of the column to the overall table width, so we can override the Foundation CSS responsive table classes.
				VARIABLES.TableWidth+= parseInt(strWidth);
				
				// Add the header cell to the table header.
				$('#' + VARIABLES.DataTable + ' > thead').append('<th id="DataHeaderCell_' + objColumnData.dataIndex + '" class="rm-DataHeaderCell ' + strSortableClass + ' override" dataIndex="' + objColumnData.dataIndex + '" sortDirection="" width="' + strWidth + '">' + objColumnData.header + '</th>');
				
				// Hide the column if needed.
				if(typeof objColumnData.hidden != 'undefined' && objColumnData.hidden == true)
				{
					$('#DataHeaderCell_' + objColumnData.dataIndex).hide();
				}
				
			});
			
			// Bind the sort event.
			$('#' + VARIABLES.DataTable + ' > thead > th.rm-Data-SortableHeader').bind('click', function(){
				
				// Store the sort column in the VARIABLES scope.
				VARIABLES.PostData.Sort = $(this).attr('dataIndex');
				
				// Get the sort direction, and change the arrows in the header.
				if($(this).attr('sortDirection') == '')
				{
					$('#' + VARIABLES.DataTable + ' > thead > th').attr('sortDirection', '').removeClass('rm-Data-SortableHeader-DESC').removeClass('rm-Data-SortableHeader-ASC');
					$(this).attr('sortDirection', 'DESC')
					VARIABLES.PostData.Dir = 'ASC';
					$(this).removeClass('rm-Data-SortableHeader-DESC').addClass('rm-Data-SortableHeader-ASC');
				}
				else if($(this).attr('sortDirection') == 'ASC')
				{
					$('#' + VARIABLES.DataTable + ' > thead > th').attr('sortDirection', '').removeClass('rm-Data-SortableHeader-DESC').removeClass('rm-Data-SortableHeader-ASC');
					$(this).attr('sortDirection', 'DESC')
					VARIABLES.PostData.Dir = 'ASC';
					$(this).removeClass('rm-Data-SortableHeader-DESC').addClass('rm-Data-SortableHeader-ASC');
				}
				else
				{
					$('#' + VARIABLES.DataTable + ' > thead > th').attr('sortDirection', '').removeClass('rm-Data-SortableHeader-DESC').removeClass('rm-Data-SortableHeader-ASC');
					$(this).attr('sortDirection', 'ASC')
					VARIABLES.PostData.Dir = 'DESC';
					$(this).removeClass('rm-Data-SortableHeader-ASC').addClass('rm-Data-SortableHeader-DESC');
				}
				
				options.dataStore.Fetch();
			});
			
			// Run the callback function, if provided.
			if (typeof callback == 'function')
			{
				callback.call(this);
			}
	
		};
		
		/*
			DrawTable
					This function draws a blank table to store the data grid.
		*/
		this.DrawTable = function(callback) {
			
			var strTable = '<table class="rm-DataTable" border="0" cellspacing="0" cellpadding="0" id="' + VARIABLES.DataTable + '"><thead class="rm-DataHeader"></thead><tbody></tbody><tfoot></tfoot></table>';
			$('#' + VARIABLES.ReportContainer).html(strTable);
			
			this.DrawHeaders();
			
			// Run the callback function, if provided.
			if (typeof callback == 'function')
			{
				callback.call(this);
			}

		};
		
		this.DrawTable();
		
	};
	
	/*
		DataStore
				This object retrieves and parses ajax data.
	*/
	this.DataStore = function(options) {
		
		// Set the default options
		var defaults = {
			id:				'myDataStore',
			proxy:			'',
			reader:			'',
			data:			'',
			method:			'ajaxGetReportData',
			ReportName:		'',
			autoLoad:		false,
			async:			true
		};
		
		// Overwrite default options with user provided ones and merge them into "options"
		var options = $.extend({}, defaults, options);
		
		// Because we need to access the DataStore's json data in other places, let's make it a property of the class.
		this.jsonData = '';
		
		// Copy (ByRef) the 'this' object into another variable so we don't lose it in scope changes.
		var thisObject = this;
		
		/*
			Fetch
					This is the function that makes the ajax call to retrieve the data. Optionally, it can parse a json array that has been passed in through the options object.
		*/
		this.Fetch = function(callback) {
		
			if(options.data != '')
			{
				try
				{
					// Parse the data before trying to process it.
					thisObject.jsonData = $.parseJSON(options.data);
					
					if(ReportType === 'DataGrid')
					{
						eval(options.ReportName + '.PopulateDataGrid()');
					}
					
				}
				catch(ex)
				{
					// TODO: Add error handling.
				}
			}
			else if (options.proxy != '')
			{
				$.ajax({
					url:		options.proxy,
					type:		'POST',
					async:		options.async,
					data:		{
									method:			options.method,
									Parameters:		VARIABLES.PostData.Parameters,
									Limit:			VARIABLES.PostData.Limit,
									Start:			VARIABLES.PostData.Start,
									Dir:			VARIABLES.PostData.Dir,
									Sort:			VARIABLES.PostData.Sort
					},
					dataType:	'json',
					success:	function(retVal){
						
						// Save this data to the object property, so we can access it outside the scope of this class.
						thisObject.jsonData = retVal;
							
						if(options.ReportName.length > 0 || typeof options.ReportName == 'object')
						{
							
							if(VARIABLES.ReportType === 'DataGrid')
							{
								// Create the report.  TODO: Investigate to see if there is a better method to use than 'eval'.
								if(typeof options.ReportName == 'object')
								{
									options.ReportName.PopulateDataGrid();
								}
								else
								{
									eval(options.ReportName + '.PopulateDataGrid()');
								}
							}
							
						}
						
					},
					failure:	function(){
						
						// TODO: Add error handling.
						
					}
				});
				
			}
			
			// Run the callback function, if provided.
			if (typeof callback == 'function')
			{
				callback.call(this);
			}
		};
		
		if(options.autoLoad)
		{
			this.Fetch();
		}
		
		this.UpdateReportName = function(objReport) {
			options.ReportName = objReport;
		}
		
	};
	
	/*
		Form
				This object builds the form used to filter the report results.
	*/
	this.Form = function(options){
		
		// Set the default options
		var defaults = {
			postUrl:			'',
			method:				'post',
			width:				'100%',
			height:				'',
			labelWidth:			'',
			standardSubmit:		false,
			location:			'top',
			dataStore:			'',
			items:				[]
		};
		
		// Overwrite default options with user provided ones and merge them into "options"
		var options = $.extend({}, defaults, options);
		
		var Items = [];
		this.Items = [];
		
		var thisForm = this;
		
		// Add the form to the page.
		$('#' + VARIABLES.FormContainer).addClass('rm-Form').attr('method', options.method).attr('action', options.postUrl).css({'width': options.width});
		
		var CreateFormInstructions = function(objItem) {
			return '<p class="rm-FormInstructions">' + objItem.fieldLabel + '</p>';
		}
		
		var CreateLabel = function(objItem) {
			
			if(typeof objItem.align == 'undefined')
			{
				objItem.align = 'left';
			}
			
			if(typeof objItem.style == 'undefined')
			{
				objItem.style = '';
			}
			
			return '<label class="rm-Form-StandaloneLabel" style="text-align: ' + objItem.align + ';' + objItem.style + '">' + objItem.fieldLabel + '</label>';
			
		}
		
		var CreateCheckboxes = function(objItem) {
			
			var retVal = '';
			
			if(typeof objItem.items != 'undefined')
			{
				$.each(objItem.items, function(x, objSubItem){
					
					retVal+= '<div>';
					retVal+= '<input type="checkbox" id="' + objItem.name + '_' + x + '" name="' + objItem.name + '" value="' + objSubItem.value + '" />';
					retVal+= '<label for="' + objItem.name + '_' + x + '" style="width: ' + objItem.withd + 'px;' + '" class="rm-Form-CheckRadioLabel">' + objSubItem.fieldLabel + '</label>';
					retVal+= '</div>';
					
				});
			}
			
			return retVal;
			
		}
		
		var CreateRadioButtons = function(objItem) {
			
			var retVal = '';
			
			if(typeof objItem.items != 'undefined')
			{
				$.each(objItem.items, function(x, objSubItem){
					
					retVal+= '<div>';
					retVal+= '<input type="radio" id="' + objItem.name + '_' + x + '" name="' + objItem.name + '" value="' + objSubItem.value + '" />';
					retVal+= '<label for="' + objItem.name + '_' + x + '" style="width: ' + objItem.width + 'px;' + '" class="rm-Form-CheckRadioLabel">' + objSubItem.fieldLabel + '</label>';
					retVal+= '</div>';
				
				});
			}
			
			return retVal;
			
		}
		
		var CreateTextbox = function(objItem) {
			
			if(typeof objItem.value == 'undefined')
			{
				objItem.value = '';
			}
			
			return '<label for="' + objItem.name + '" style="width: ' + objItem.width + 'px;' + '" class="rm-Form-Label">' + objItem.fieldLabel + objItem.labelSeparator + '</label><input type="text" name="' + objItem.name + '" id="' + objItem.name + '" placeholder="' + objItem.placeholder + '" required="' + objItem.required + '" class="rm-Form-TextInput" value="' + objItem.value + '" />';
		}
		
		var CreateDatebox = function(objItem) {
			
			if(typeof objItem.value == 'undefined')
			{
				objItem.value = '';
			}
			
			return '<label for="' + objItem.name + '" style="width: ' + objItem.width + 'px;' + '" class="rm-Form-Label">' + objItem.fieldLabel + objItem.labelSeparator + '</label><input type="date" name="' + objItem.name + '" id="' + objItem.name + '" placeholder="' + objItem.placeholder + '" required="' + objItem.required + '" class="rm-Form-TextInput" value="' + objItem.value + '" />';
		}
		
		var CreateHiddenField = function(objItem) {
			return '<input type="hidden" name="' + objItem.name + '" id="' + objItem.name + '" value="' + objItem.value + '" />';				
		}
		
		var CreateDropdownList = function(objItem, rowContainer) {
			
			if(typeof objItem.items == 'undefined')
			{
				objItem.items = [];
			}
			
			if(typeof objItem.showCustomDate == 'undefined')
			{
				objItem.showCustomDate = false;
			}
			
			if(typeof objItem.listeners == 'undefined')
			{
				objItem.listeners = '';
			}
			
			// Use the UI system to create the dropdown.
			var ddl = new ReportManager.UI.DropdownList({
				name:				objItem.name,
				panelID:			'divDropdownList_' + objItem.name,
				rowContainer:		rowContainer,
				multiSelect:		false,
				dataStore:			objItem.dataStore,
				valueField:			objItem.valueField,
				displayField:		objItem.displayField,
				showCustomDate:		objItem.showCustomDate,
				items:				objItem.items,
				listeners:			objItem.listeners
			}, function(){
				
				// This is the callback.  Anything in here will take place after the class has added the form item to the page.
				
			});
			
		}
		
		var CreateMultiSelectList = function(objItem, rowContainer) {
			
			if(typeof objItem.showCustomDate == 'undefined')
			{
				objItem.showCustomDate = false;
			}
			
			// Use the UI system to create the dropdown.
			var ddl = new ReportManager.UI.DropdownList({
				name:				objItem.name,
				panelID:			'divDropdownList_' + objItem.name,
				rowContainer:		rowContainer,
				multiSelect:		true,
				placeholder:		objItem.placeholder,
				dataStore:			objItem.dataStore,
				valueField:			objItem.valueField,
				displayField:		objItem.displayField,
				showCustomDate:		objItem.showCustomDate
			}, function(){
				
				// This is the callback.  Anything in here will take place after the class has added the form item to the page.
				
			});
			
		}
		
		var CreateGoogleStyleDropdownList = function(objItem, rowContainer) {
			
			if(typeof objItem.items == 'undefined')
			{
				objItem.items = [];
			}
			
			if(typeof objItem.showCustomDate == 'undefined')
			{
				objItem.showCustomDate = false;
			}
			
			if(typeof objItem.listeners == 'undefined')
			{
				objItem.listeners = '';
			}
			
			// Use the UI system to create the dropdown.
			var ddl = new ReportManager.UI.GoogleStyleDropdown({
				name:				objItem.name,
				panelID:			'divDropdownList_' + objItem.name,
				rowContainer:		rowContainer,
				multiSelect:		false,
				dataStore:			objItem.dataStore,
				valueField:			objItem.valueField,
				displayField:		objItem.displayField,
				showCustomDate:		objItem.showCustomDate,
				items:				objItem.items,
				listeners:			objItem.listeners
			}, function(){
				
				// This is the callback.  Anything in here will take place after the class has added the form item to the page.
				
			});
			
		}
		
		$('#' + VARIABLES.FormContainer).append('<div id="divRMSearchForm" class="row"></div>');
		
		$.each(options.items.rows, function(r, objRow) {
			
			if(typeof objRow.display == 'undefined')
			{
				objRow.display = 'block';
			}
			
			$('#divRMSearchForm').append('<div class="twelve columns" style="display: ' + objRow.display + ';"><div class="row" id="divRMFormRow_' + r + '"></div></div>');
			
			$.each(objRow.cells, function(c, objCell) {
			
				$('#divRMFormRow_' + r).append('<div class="' + objCell.columns + ' columns" id="tdFormRow_' + r + '_Cell_' + c + '"></div>');
			
				objItem = objCell.item;
				
				Items.push(objItem);
				
				// If the label width has been overridden...
				if(typeof objItem.labelWidth == 'undefined')
				{
					objItem.labelWidth = 80;
				}
				
				// If the placeholder text has been overridden...
				if(typeof objItem.placeholder == 'undefined')
				{
					objItem.placeholder = '';
				}
				
				// If the label separator has been overridden...
				if(typeof objItem.labelSeparator == 'undefined')
				{
					objItem.labelSeparator = '';
				}
				
				if(typeof objItem.required == 'undefined')
				{
					objItem.required = false;
				}
				
				/*
					Process the different form item types
				*/
				if(objItem.type == 'fieldset')
				{
					
					
				}
				else if(objItem.type == 'checkbox')
				{
					
					var strFormItem = '<div class="rm-FormRow" id="formRow_' + c + '">';
					strForm+= CreateCheckboxes(objItem);
					strFormItem+= '</div>';
					
					$('#tdFormRow_' + r + '_Cell_' + c).append(CreateCheckboxes(objItem));
					
				}
				else if(objItem.type == 'radio')
				{
					
					var strFormItem = '<div class="rm-FormRow" id="formRow_' + c + '">';
					strFormItem+= CreateRadioButtons(objItem);
					strFormItem+= '</div>';
					
					$('#tdFormRow_' + r + '_Cell_' + c).append(CreateRadioButtons(objItem));
					
				}
				else if(objItem.type == 'textbox')
				{
					
					var strFormItem = '<div class="rm-FormRow" id="formRow_' + c + '">';
					strFormItem+= CreateTextbox(objItem);				
					strFormItem+= '</div>';
					
					$('#tdFormRow_' + r + '_Cell_' + c).append(CreateTextbox(objItem));
					
				}
				else if(objItem.type == 'date')
				{
					
					//var strFormItem = '<div class="rm-FormRow" id="formRow_' + c + '">';
					//strFormItem = CreateDatebox(objItem);
					//strFormItem+= '</div>';
					
					$('#tdFormRow_' + r + '_Cell_' + c).append(CreateDatebox(objItem));
					
					if(typeof objItem.display != 'undefined' && objItem.display == 'hidden')
					{
						$('#tdFormRow_' + r + '_Cell_' + c).hide();
					}
					
				}
				else if(objItem.type == 'hidden')
				{
					
					var strFormItem = '<div class="rm-FormRow" id="formRow_' + c + '">';
					strFormItem+= CreateHiddenField(objItem);
					strFormItem+= '</div>';
					
					$('#tdFormRow_' + r + '_Cell_' + c).append(CreateHiddenField(objItem));
					
				}
				
				else if(objItem.type == 'dropdownList')
				{

					// Create the label first, within a form row div, so we can add the complex form item type to the form.
					$('#tdFormRow_' + r + '_Cell_' + c).append('<label for="' + objItem.name + '" style="width: ' + objItem.labelWidth + 'px;" class="rm-Form-Label">' + objItem.fieldLabel + objItem.labelSeparator + '</label>');
					
					CreateDropdownList(objItem, 'tdFormRow_' + r + '_Cell_' + c);
					
				}
				
				else if(objItem.type == 'multiSelectList')
				{
					if(typeof objItem.width == 'undefined')
					{
						objItem.width = options.width - (90);
					}
					
					// Create the label first, within a form row div, so we can add the complex form item type to the form.
					$('#tdFormRow_' + r + '_Cell_' + c).append('<label for="' + objItem.name + '" style="width: ' + objItem.labelWidth + 'px;" class="rm-Form-Label">' + objItem.fieldLabel + objItem.labelSeparator + '</label>');
					
					CreateMultiSelectList(objItem, 'tdFormRow_' + r + '_Cell_' + c);
					
				}
				
				else if(objItem.type == 'GoogleStyleDropdown')
				{
					if(typeof objItem.width == 'undefined')
					{
						objItem.width = options.width - (90);
					}
					
					// Create the label first, within a form row div, so we can add the complex form item type to the form.
					$('#tdFormRow_' + r + '_Cell_' + c).append('<label for="' + objItem.name + '" style="width: ' + objItem.labelWidth + 'px;" class="rm-Form-Label">' + objItem.fieldLabel + objItem.labelSeparator + '</label>');
					
					CreateGoogleStyleDropdownList(objItem, 'tdFormRow_' + r + '_Cell_' + c);
					
				}
				
				else if(objItem.type == 'formInstructions')
				{
					var strFormItem = '<div class="rm-FormRow" id="formRow_' + c + '">';
					strFormItem+= CreateFormInstructions(objItem);
					strFormItem+= '</div>';
					
					$('#tdFormRow_' + r + '_Cell_' + c).append(CreateFormInstructions(objItem));
				}
				
				else if(objItem.type == 'label')
				{
					var strFormItem = '<div class="rm-FormRow" id="formRow_' + c + '">';
					strFormItem+= CreateLabel(objItem);
					strFormItem+= '</div>';
					
					$('#tdFormRow_' + r + '_Cell_' + c).append(CreateLabel(objItem));
				}
				
				else if(objItem.type == 'button')
				{
					if(typeof objItem.additionalClasses == 'undefined')
					{
						objItem.additionalClasses = '';
					}
					
					if(typeof objItem.style == 'undefined')
					{
						objItem.style = '';
					}
					
					var strFormItem = '<div class="rm-FormRow" id="formRow_' + c + '">';
					strFormItem+= '<input type="' + objItem.buttonType + '" value="' + objItem.fieldLabel + '" id="' + objItem.name + '" name="' + objItem.name + '" class="button ' + objItem.additionalClasses + '" style="' + objItem.style + '" />';
					$('#tdFormRow_' + r + '_Cell_' + c).append(strFormItem);
					
				}
				
				try
				{
					if(typeof objItem.listeners != 'undefined')
					{
						$.each(objItem.listeners, function(index, listener){
							
							$(listener.appliesTo).bind(listener.event, function(e){
								
								if (typeof listener.execute == 'function')
								{
									listener.execute.call(this);
								}
							});/**/
						});
					}
					
				}
				catch(ex)
				{
					logToConsole(ex);
				}

			});
			
		});
		
		this.Items = Items;
		
		/*
			CreateSubmitButton
					
		*/
		this.CreateSubmitButton = function(callback){
			
			$('#' + VARIABLES.FormContainer).append('<input type="submit" value="Search" id="btnSubmit" class="button" />');
			
			// If we are not using the standard form submit, and instead are making an ajax call, we need to bind the event to the button.
			if(options.standardSubmit == false)
			{
				$('#btnSubmit').bind('click', function(e){
					
					// Prevent the form submit from occuring, so we can process the ajax call.
					e.preventDefault();
					
					// Make sure the form is valid before proceeding.
					if(thisForm.ValidateForm())
					{
					
						// Get the new parameters from the form.
						var strNewParameters = '';
						
						$.each(Items, function(i, objItem) {
							
							if(typeof objItem.spParameterName != 'undefined' || objItem.name == 'x')
							{
								strNewParameters+= objItem.name + '|' + $('#' + objItem.name).val() + '$';
							}
							
						});
						
						// Update the parameters.
						ReportManager.UpdateParameters(strNewParameters);
						
						// Fetch the data.
						options.dataStore.Fetch();
						
					
					}
					
				});
				
			}
			
			// Run the callback function, if provided.
			if (typeof callback == 'function')
			{
				callback.call(this);
			}
			
		};
		
		this.CreateExportButton = function(buttonPlacement, postUrl, callback){

			if(buttonPlacement == 'form')
			{
				$('#' + VARIABLES.FormContainer).append('<input type="submit" value="Export" id="btnExport" class="button secondary" />');
			}
			else if(buttonPlacement == 'report')
			{
				$('#' + VARIABLES.ReportContainer).prepend('<div class="twelve column" style="text-align: right; margin-bottom: 10px;"><span class="rm-ExportLink" id="btnExport">Export</span></div>');
			}
			
			if(typeof postUrl == 'undefined')
			{
				postUrl = 'Report.cfc?method=ajaxGetReportDataForExcel';
			}
			
			$('#btnExport').bind('click', function(e){
				
				// Prevent the form submit from occuring, so we can process the ajax call.
				e.preventDefault();
				
				// Make sure the form is valid before proceeding.
				if(thisForm.ValidateForm())
				{
				
					// Get the new parameters from the form.
					var strNewParameters = '';

					$.each(Items, function(i, objItem) {
						
						if(typeof objItem.spParameterName != 'undefined' || objItem.name == 'x')
						{
							strNewParameters+= objItem.name + '|' + $('#' + objItem.name).val() + '$';
						}
						
					});
					
					window.open(postUrl + '&ExcelExportParameters=' + strNewParameters, '_blank');
				
				}
				
			});
				
		};
		
		this.ValidateForm = function(){
			return true;
		};
		
	};
	
	/*
		DataGrid
				This object builds the report as a data grid.
	*/
	this.DataGrid = function(options){
		
		// Set the default options
		var defaults = {
			id:					'myGrid',
			pagingBar:			'',
			totalsBar:			'',
			dataStore:			'',
			columnModel:		''
		};
		
		// Overwrite default options with user provided ones and merge them into "options"
		var options = $.extend({}, defaults, options);
		
		// Take the JSON data, and create the rows from it.
		this.PopulateDataGrid = function(callback) {
			
			// Reset the DataGrid
			$('#' + VARIABLES.DataTable + ' > tbody').html('');
			
			// Make sure the JSON data is an object
			if(typeof options.dataStore.jsonData == 'object')
			{
				// Make sure records were returned.
				if(options.dataStore.jsonData.rows.length > 0)
				{
					// Iterate through each record.
					$.each(options.dataStore.jsonData.rows, function(i, objRow) {
					
						var strRow = '<tr class="rm-DataTableRow">';
						
						// Iterate through the columns and build the table row.
						$.each(options.columnModel.ColumnDefinitions, function(x, objColumnData) {
							
							// Set the default data type for the column to 'string'.
							var strDataType = 'string';
							
							// Get the actual data type.
							if(typeof objColumnData.dataType != 'undefined')
							{
								strDataType = objColumnData.dataType;
							}
							
							// If the data type is a date, we need to format it.
							if(strDataType == 'date')
							{
								objRow[objColumnData.dataIndex] = DateFormat(objRow[objColumnData.dataIndex], 'MMMM dd, yyyy HH:mm:ss');  // Note, this is not the ColdFusion DateFormat function, this is a javascript function found in the archimedes.ReportManager.utils.js file.
							}
					
							// Hide the column if specified.
							if(typeof objColumnData.hidden != 'undefined' && objColumnData.hidden == true)
							{
								strRow+= '<td style="white-space: no-wrap;" class="rm-DataTableCell rm-DataType-' + strDataType + '" style="display: none;">' + objRow[objColumnData.dataIndex] + '</td>';
							}
							else
							{
								strRow+= '<td style="white-space: no-wrap;" class="rm-DataTableCell rm-DataType-' + strDataType + '">' + objRow[objColumnData.dataIndex] + '</td>';
							}
							
						});
						
						strRow+= '</tr>';
						
						// Add the row to the table.
						$('#' + VARIABLES.DataTable + ' > tbody').append(strRow);
			
						// Add pretty zebra stripes.
						$('#' + VARIABLES.DataTable + ' tbody tr:odd').addClass('rm-DataTableCell-Odd');
						$('#' + VARIABLES.DataTable + ' tbody tr:even').addClass('rm-DataTableCell-Even');
			
					});
				}
				
				// If there weren't any records returned, create a simple row that informs the user.
				else
				{
					var intColumnCount = options.columnModel.ColumnDefinitions.length;
					var strRow = '<tr class="rm-DataTableRow"><td colspan="' + intColumnCount + '" align="center">No Records Found</td></tr>';
					$('#' + VARIABLES.DataTable + ' > tbody').append(strRow);
				}
			}
			
			// Load the paging bar, if configured.
			if(typeof options.pagingBar == 'object')
			{
				options.pagingBar.DrawBar();
			}
			
			// Load the totals bar, if configured.
			if(typeof options.totalsBar == 'object')
			{
				options.totalsBar.DrawBar();
			}
			
			// This is a custom function to override the style of an element.  The normal way was not working because it does not set the priority correctly.
			if(VARIABLES.TableWidth > $('#' + VARIABLES.ReportContainer).outerWidth())
			{
				$('#' + VARIABLES.DataTable).style('width', VARIABLES.TableWidth + 'px',  'important');
			}
			
		}
		
		// Run the callback function, if provided.
		if (typeof callback == 'function')
		{
			callback.call(this);
		}
		
	};
	
	/*
		TotalsBar
				This object builds a row at the bottom of the grid with totals for the specified columns.
	*/
	this.TotalsBar = function(options, callback) {
		
		// Set the default options
		var defaults = {
			dataStore:		'',
			columnModel:	'',
			columns:		[]
		};
	
		// Overwrite default options with user provided ones and merge them into "options"
		var options = $.extend({}, defaults, options);
		
		// Create the bar.
		this.DrawBar = function(){
			
			var strTotalBar = '<tr>';
			var arrColumnTotals = [];
			
			// Build an array of each specified column, with zero totals.  We'll add the actual values later.
			$.each(options.columns, function(i, strColumn) {
				arrColumnTotals.push({columnName: strColumn, columnTotal: 0});
			});
			
			// Iterate through the JSON data.
			$.each(options.dataStore.jsonData.rows, function(i, objRow) {
				
				// Iterate through the columns.
				$.each(options.columnModel.ColumnDefinitions, function(x, objColumn) {
					
					// Find out if the current column is in the passed column array.
					var intIndex = $.inArray(objColumn.dataIndex, options.columns);
					
					// If so, add the totals of this row to the appropriate array element.
					if(intIndex >= 0)
					{
						arrColumnTotals[intIndex].columnTotal+= parseInt(objRow[objColumn.dataIndex]);
					}
					
				});
				
			});
			
			// Now that we have the totals, we need to create the row.
			$.each(options.columnModel.ColumnDefinitions, function(i, objColumn) {
				
				strTotalBar+= '<td class="rm-DataTable-TotalCell">';
				
				// Once again, find the column in the array.
				var intIndex = $.inArray(objColumn.dataIndex, options.columns);
				
				// If it is there, show the total.
				if(intIndex >= 0)
				{
					strTotalBar+= 'Total: ' + arrColumnTotals[intIndex].columnTotal;
				}
				
				strTotalBar+= '</td>';
				
			});
			
			strTotalBar+= '</tr>';
			
			// Add it to the table.
			$('#' + VARIABLES.DataTable + ' > tbody').append(strTotalBar);
			
		};
		
		// Run the callback function, if provided.
		if (typeof callback == 'function')
		{
			callback.call(this);
		}
		
	};
	
	/*
		PagingBar
				This object builds a row at the bottom of the grid to handle paging.
	*/
	this.PagingBar = function(options, callback) {
	
		// Set the default options
		var defaults = {
			dataStore:		''
		};
	
		// Overwrite default options with user provided ones and merge them into "options"
		var options = $.extend({}, defaults, options);
		
		// Create the bar.
		this.DrawBar = function(){
			
			// Get the paging numbers.
			var intTotalRecords = options.dataStore.jsonData.totalCount;
			var intColspan = Math.floor(VARIABLES.ColumnDefinitions.length / 2);
			var intStartRecord = parseInt(VARIABLES.PostData.Start);
			var intCurrentPage = Math.ceil(intStartRecord / VARIABLES.PostData.Limit);
			var intEnd = VARIABLES.PostData.Limit * intCurrentPage;
			var intTotalPages = Math.ceil(intTotalRecords / VARIABLES.PostData.Limit);
			
			// If this is the last page, and the number of records is less than the limit for the page, set the intEnd variable to the total records.
			if(intTotalRecords < intEnd)
			{
				intEnd = intTotalRecords;
			}
			
			var strBar = '<td colspan="' + intColspan + '" class="" valign="middle">';// --&gt;</td>';
			
			strBar+= '<ul class="pagination">';
			
			// Create the 'Previous' button.
			if(intStartRecord <= 1)
			{
				strBar+= '<li class="arrow unavailable"><a href=""">&laquo;</a></li>';
			}
			else
			{
				strBar+= '<li class="arrow"><a href="" page="' + parseInt(intCurrentPage - 1) + '">&laquo;</a></li>';
			}
			
			// If the current page is the first one, show it as current.  We will always keep the first and  pages in the list regardless of how far through the paging chain the user is.
			if(intCurrentPage == 1)
			{
				strBar+= '<li class="current"><a href="" page="1">1</a></li>';
			}
			else
			{
				strBar+= '<li><a href="" page="1">1</a></li>';
			}
			
			// Show the first 4 pages.
			if(intTotalPages > 1 && intCurrentPage < 5)
			{
				strBar+= '<li';
				if(intCurrentPage == 2)
				{
					strBar+= ' class="current"';
				}
				strBar+= '><a href="" page="2">2</a></li>';
				
				strBar+= '<li';
				if(intCurrentPage == 3)
				{
					strBar+= ' class="current"';
				}
				strBar+= '><a href="" page="3">3</a></li>';
				
				strBar+= '<li';
				if(intCurrentPage == 4)
				{
					strBar+= ' class="current"';
				}
				strBar+= '><a href="" page="4">4</a></li>';
			}
			
			// Otherwise, we show the current page, plus the 2 before, and the 2 after.
			else if(intCurrentPage > 4)
			{
				var intPrevPage = intCurrentPage - 1;
				var intPrevPrevPage = intCurrentPage - 2;
				
				strBar+= '<li class="unavailable">&hellip;</li>';
				strBar+= '<li><a href="" page="' + intPrevPrevPage + '">' + intPrevPrevPage + '</a></li>';
				strBar+= '<li><a href="" page="' + intPrevPage + '">' + intPrevPage + '</a></li>';
				strBar+= '<li class="current"><a href="" page="' + intCurrentPage + '">' + intCurrentPage + '</a></li>';
				
			}
			
			if(intTotalPages > intCurrentPage + 3 && intCurrentPage > 4)
			{
				strBar+= '<li><a href="" page="' + parseInt(intCurrentPage + 1) + '">' + parseInt(intCurrentPage + 1) + '</a></li>';
				strBar+= '<li><a href="" page="' + parseInt(intCurrentPage + 2) + '">' + parseInt(intCurrentPage + 2) + '</a></li>';
			}
			else
			{
				if(intTotalPages > intCurrentPage + 1 && intCurrentPage > 4)
				{
					strBar+= '<li><a href="" page="' + parseInt(intCurrentPage + 1) + '">' + parseInt(intCurrentPage + 1) + '</a></li>';
				}
				if(intTotalPages > intCurrentPage + 2 && intCurrentPage > 4)
				{
					strBar+= '<li><a href="" page="' + parseInt(intCurrentPage + 2) + '">' + parseInt(intCurrentPage + 2) + '</a></li>';
				}
			}
			
			// Show an ellipsis between the last page, and the page 2 above the current.
			if(intTotalPages > intCurrentPage + 3)
			{
				strBar+= '<li class="unavailable">&hellip;</li>';
			}
			
			// Show the last page.
			if(intTotalPages > intCurrentPage)
			{
				strBar+= '<li><a href="" page="' + intTotalPages + '">' + intTotalPages + '</a></li>';
			}
			
			// Show the 'Next' button.
			if(intCurrentPage < intTotalPages)
			{
				strBar+= '<li class="arrow"><a href="" page="' + parseInt(intCurrentPage + 1) + '">&raquo;</a></li>';
			}
			else
			{
				strBar+= '<li class="arrow unavailable"><a href="">&raquo;</a></li>';
			}
			
			strBar+= '</ul>';
			
			// If the table has an odd number of columns, we need to add a spacer column in the middle.
			if(VARIABLES.ColumnDefinitions.length > 2 && IsEven(VARIABLES.ColumnDefinitions.length) == false)
			{
				strBar+= '<td class="rm-Paging-PagingBarCellLeft"></td>';
			}
			
			strBar+= '<td colspan="' + intColspan + '" class="rm-Paging-PagingBarCellRight" valign="top" align="right" style="text-align: right; padding-top: 14px;">Displaying results ' + intStartRecord + ' - ' + intEnd + ' of ' + intTotalRecords + '</td>';
			
			// Only show the bar if there were actually records returned.
			if(intTotalRecords > 0)
			{
				
				// Add the bar to the footer.
				$('#' + VARIABLES.DataTable + ' > tfoot').html(strBar);
				
				// Bind the datastore Fetch method to the buttons.
				$('.pagination > li > a').bind('click', function(e) {
					e.preventDefault();
					if(!$(this).parent().hasClass('unavailable') && !$(this).parent().hasClass('current'))
					{
						var intPageNumber = parseInt($(this).attr('page')) - 1;
						VARIABLES.PostData.Start = (intPageNumber * VARIABLES.PostData.Limit) + 1;
						options.dataStore.Fetch();
					}
					
				});
			
			}
			
		};
		
		// Run the callback function, if provided.
		if (typeof callback == 'function')
		{
			callback.call(this);
		}
		
	};
	
	this.SetReportType = function(reportType) {
		VARIABLES.ReportType = reportType;
	}
	
	this.GetReportType = function() {
		return VARIABLES.ReportType;
	}
	
	this.SetReportContainerName = function(name) {
		VARIABLES.ReportContainer = name;
	}
	
	this.UpdateParameters = function(parameters)
	{
		VARIABLES.PostData.Parameters = parameters;
	}
	
	// This method is used to merge parameters from the query string.
	this.MergeParameters = function(queryString, formName)
	{
		var formItems = eval(formName + '.Items');
		var strNewParameters = '';
		
		$.each(formItems, function(i, item) {
			
			if(typeof item.spParameterName != 'undefined' || item.name == 'x')
			{
			
				if(typeof eval('queryString.' + item.name) != 'undefined')
				{
					strNewParameters+= item.name + '|' + eval('queryString.' + item.name) + ',';
				}
				else
				{
					strNewParameters+= item.name + '|' + $('#' + item.name).val() + ',';
				}
			}
			
		});
		
		ReportManager.UpdateParameters(strNewParameters);
	}
	
	this.GetParameters = function()
	{
		return VARIABLES.PostData.Parameters;
	}
	
	this.UpdateLimit = function(limit)
	{
		VARIABLES.PostData.Limit = limit;
	}
	
	this.GetLimit = function()
	{
		return VARIABLES.PostData.Limit;
	}
	
	this.UpdateStart = function(start)
	{
		VARIABLES.PostData.Start = start;
	}
	
	this.GetStart = function()
	{
		return VARIABLES.PostData.Start;
	}
	
	this.UpdateDir = function(dir)
	{
		VARIABLES.PostData.Dir = dir;
	}
	
	this.GetDir = function()
	{
		return VARIABLES.PostData.Dir;
	}
	
	this.UpdateSort = function(sort)
	{
		VARIABLES.PostData.Sort = sort;
	}
	
	this.GetSort = function()
	{
		return VARIABLES.PostData.Sort;
	}
	
};

var ReportManager = new ArchimedesReportManager();

