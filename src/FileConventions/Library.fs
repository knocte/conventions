﻿module FileConventions

open System
open System.IO
open System.Linq
open System.Text.RegularExpressions

let HasCorrectShebang(fileInfo: FileInfo) =
    let fileText = File.ReadLines fileInfo.FullName

    if fileText.Any() then
        let firstLine = fileText.First()

        firstLine.StartsWith "#!/usr/bin/env fsx"
        || firstLine.StartsWith "#!/usr/bin/env -S dotnet fsi"

    else
        false

let MixedLineEndings(fileInfo: FileInfo) =
    let fileText = File.ReadAllText fileInfo.FullName

    let lf = Regex("[^\r]\n", RegexOptions.Compiled)
    let cr = Regex("\r[^\n]", RegexOptions.Compiled)
    let crlf = Regex("\r\n", RegexOptions.Compiled)

    let numberOfLineEndings =
        [
            lf.IsMatch fileText
            cr.IsMatch fileText
            crlf.IsMatch fileText
        ]
        |> Seq.filter(
            function
            | isMatch -> isMatch = true
        )
        |> Seq.length

    numberOfLineEndings > 1

let DetectUnpinnedVersionsInGitHubCI(fileInfo: FileInfo) =
    assert (fileInfo.FullName.EndsWith(".yml"))

    let fileText = File.ReadAllText fileInfo.FullName

    let latestTagInRunsOnRegex =
        Regex("runs-on: .*-latest", RegexOptions.Compiled)

    latestTagInRunsOnRegex.IsMatch fileText

let DetectAsteriskInPackageReferenceItems(fileInfo: FileInfo) =
    assert (fileInfo.FullName.EndsWith "proj")

    let fileText = File.ReadAllText fileInfo.FullName

    let asteriskInPackageReference =
        Regex(
            "<PackageReference.*Version=\".*\*.*\".*/>",
            RegexOptions.Compiled
        )

    asteriskInPackageReference.IsMatch fileText

let DetectMissingVersionsInNugetPackageReferences(fileInfo: FileInfo) =
    assert (fileInfo.FullName.EndsWith ".fsx")

    let fileLines = File.ReadLines fileInfo.FullName

    not(
        fileLines
        |> Seq.filter(fun line -> line.StartsWith "#r \"nuget:")
        |> Seq.filter(fun line -> not(line.Contains ","))
        |> Seq.isEmpty
    )
