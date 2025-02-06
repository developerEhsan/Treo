# Requires the UIAutomation module (install with Install-Module UIAutomation)

try {
  # Find the foreground window
  $ForegroundWindow = Get-Process | Where-Object {$_.MainWindowTitle} | Sort-Object StartTime -Descending | Select-Object -First 1

  if ($ForegroundWindow) {
    # Get the UI Automation root element for the foreground window
    $UIA = [UIAutomation.UIA]::Instance
    $RootElement = $UIA.ElementFromHandle($ForegroundWindow.MainWindowHandle)

    # Find the focused element (which usually contains the caret)
    $FocusedElement = $RootElement.FindFirst("TreeScope_Descendants", $UIA.FocusedPropertyCondition)

    if ($FocusedElement) {
      # Get the text range of the focused element (if it supports text patterns)
      $TextPattern = $FocusedElement.GetCurrentPattern([UIAutomation.UIA.TextPattern]::Pattern)

      if ($TextPattern) {
        # Get the current text selection (which often corresponds to the caret position)
        $TextSelection = $TextPattern.GetSelection()

        if ($TextSelection.Count -gt 0) {
          # Get the first range of the selection (usually the only one)
          $Range = $TextSelection[0]

          # Get the start and end points of the range (caret is usually at the start or end)
          $StartPoint = $Range.GetEndPoint([UIAutomation.UIA.TextPatternRangeEndpoint.Start])
          $EndPoint = $Range.GetEndPoint([UIAutomation.UIA.TextPatternRangeEndpoint.End])

          # Return the caret position (character index) within the text
          $CaretPosition = $StartPoint.GetIndex() # or $EndPoint.GetIndex() if at end

          # Output the caret position as JSON (for easy use in Electron)
          @{ caretPosition = $CaretPosition } | ConvertTo-Json
        } else {
          # No text selection, try to get caret position directly (less reliable)
          # Note: This may not work in all applications
          try {
            $CaretPosition = $FocusedElement.GetCurrentPropertyValue([UIAutomation.UIA.TextPattern.CaretPositionProperty])
            @{ caretPosition = $CaretPosition } | ConvertTo-Json
          }
          catch {
            Write-Warning "Could not determine caret position."
            @{ caretPosition = -1; error = "Could not determine caret position." } | ConvertTo-Json # Indicate error
          }

        }
      } else {
        Write-Warning "Focused element does not support text pattern."
        @{ caretPosition = -1; error = "Focused element does not support text pattern." } | ConvertTo-Json # Indicate error
      }
    } else {
      Write-Warning "Could not find focused element."
      @{ caretPosition = -1; error = "Could not find focused element." } | ConvertTo-Json # Indicate error
    }
  } else {
    Write-Warning "Could not find foreground window."
    @{ caretPosition = -1; error = "Could not find foreground window." } | ConvertTo-Json # Indicate error
  }
}
catch {
  Write-Error "An error occurred: $_"
  @{ caretPosition = -1; error = $_.Exception.Message } | ConvertTo-Json  # Return error information as JSON
}
