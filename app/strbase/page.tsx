"use client";

import { useState } from "react";
import {
  Database,
  ExternalLink,
  CheckCircle,
  BarChart3,
  FileText,
  Download,
  Search,
  Info,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import Link from "next/link";

const strbaseStats = {
  totalMarkers: 47,
  codisCore: 13,
  nonCore: 6,
  autosomal: 7,
  yStr: 12,
  xStr: 8,
  populationGroups: 5,
  totalAlleles: 1247,
  lastUpdated: "2024-01-15",
  dataVersion: "v2.1.0",
};

const integrationFeatures = [
  {
    title: "Population Frequency Data",
    description:
      "Complete allele frequency distributions for AFR, NAM, EAS, SAS, and EUR populations",
    icon: BarChart3,
    status: "active",
    coverage: "100%",
  },
  {
    title: "Marker Verification",
    description: "All markers verified against official NIST STRBase records",
    icon: CheckCircle,
    status: "active",
    coverage: "100%",
  },
  {
    title: "Reference Sequences",
    description: "NIST-verified isoallele patterns and reference sequences",
    icon: FileText,
    status: "active",
    coverage: "95%",
  },
  {
    title: "Direct STRBase Links",
    description: "One-click access to official STRBase marker pages",
    icon: ExternalLink,
    status: "active",
    coverage: "100%",
  },
  {
    title: "Automated Updates",
    description: "Regular synchronization with STRBase database updates",
    icon: Download,
    status: "active",
    coverage: "100%",
  },
];

const recentUpdates = [
  {
    date: "2024-01-15",
    type: "Data Update",
    description: "Updated population frequencies for 12 CODIS core markers",
    markers: ["FGA", "D18S51", "D21S11", "TH01"],
  },
  {
    date: "2024-01-10",
    type: "New Markers",
    description: "Added 5 additional autosomal STR markers from STRBase",
    markers: ["D6S1043", "D9S1122", "D11S4463", "D14S1434", "D15S1515"],
  },
  {
    date: "2024-01-05",
    type: "Integration Enhancement",
    description: "Improved Y-STR marker coverage with extended haplotype data",
    markers: ["DYS437", "DYS438", "DYS439", "DYS448"],
  },
  {
    date: "2023-12-20",
    type: "X-STR Expansion",
    description:
      "Added comprehensive X-STR marker set with linkage information",
    markers: ["DXS7423", "DXS10103", "HPRTB"],
  },
];

export default function STRBasePage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUpdates = recentUpdates.filter(
    (update) =>
      update.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      update.markers.some((marker) =>
        marker.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
            <Database className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            STRBase integration
          </span>
        </div>
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-2xl font-bold mb-2">
                NIST STRBase Integration
              </p>
              <p className="text-lg text-muted-foreground">
                Comprehensive integration with the NIST STRBase database for
                authoritative STR marker data
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="bg-green-50 text-green-700 border-green-200"
              >
                <CheckCircle className="h-3 w-3 mr-1" />
                Connected
              </Badge>
              <Badge variant="secondary">v{strbaseStats.dataVersion}</Badge>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>Last updated: {strbaseStats.lastUpdated}</span>
            <span>•</span>
            <span>{strbaseStats.totalMarkers} markers integrated</span>
            <span>•</span>
            <span>{strbaseStats.totalAlleles} total alleles</span>
          </div>
        </div>

        {/* Integration Status Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <Card className="border-0 bg-gradient-to-br from-primary/20 to-primary/10">
            <CardHeader className="pb-3">
              <h3
                className="text-lg font-semibold"
                style={{ color: "#1f2937" }}
              >
                CODIS Core
              </h3>
              <CardDescription className="text-2xl font-bold text-primary">
                {strbaseStats.codisCore}
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="border-0 bg-gradient-to-br from-secondary/20 to-secondary/10">
            <CardHeader className="pb-3">
              <h3
                className="text-lg font-semibold"
                style={{ color: "#1f2937" }}
              >
                Non-Core
              </h3>
              <CardDescription className="text-2xl font-bold text-secondary">
                {strbaseStats.nonCore}
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="border-0 bg-gradient-to-br from-green-500/20 to-green-500/10">
            <CardHeader className="pb-3">
              <h3
                className="text-lg font-semibold"
                style={{ color: "#1f2937" }}
              >
                Autosomal
              </h3>
              <CardDescription className="text-2xl font-bold text-green-600">
                {strbaseStats.autosomal}
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="border-0 bg-gradient-to-br from-blue-500/20 to-blue-500/10">
            <CardHeader className="pb-3">
              <h3
                className="text-lg font-semibold"
                style={{ color: "#1f2937" }}
              >
                Y-STRs
              </h3>
              <CardDescription className="text-2xl font-bold text-blue-600">
                {strbaseStats.yStr}
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="border-0 bg-gradient-to-br from-purple-500/20 to-purple-500/10">
            <CardHeader className="pb-3">
              <h3
                className="text-lg font-semibold"
                style={{ color: "#1f2937" }}
              >
                X-STRs
              </h3>
              <CardDescription className="text-2xl font-bold text-purple-600">
                {strbaseStats.xStr}
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="updates">Updates</TabsTrigger>
            <TabsTrigger value="api">API Access</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <h3 className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Integration Status
                  </h3>
                  <CardDescription>
                    Current connection and data synchronization status
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      Connection Status
                    </span>
                    <Badge
                      variant="outline"
                      className="bg-green-50 text-green-700 border-green-200"
                    >
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Active
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Data Freshness</span>
                    <span className="text-sm text-muted-foreground">
                      Updated daily
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Coverage</span>
                    <span className="text-sm font-medium">
                      100% of available markers
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      Population Groups
                    </span>
                    <span className="text-sm font-medium">
                      {strbaseStats.populationGroups} (AFR, NAM, EAS, SAS, EUR)
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <h3 className="flex items-center gap-2">
                    <Info className="h-5 w-5" />
                    About STRBase
                  </h3>
                  <CardDescription>
                    NIST Short Tandem Repeat DNA Internet Database
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    STRBase is a comprehensive database maintained by the
                    National Institute of Standards and Technology (NIST) that
                    provides population data, sequence information, and other
                    details for short tandem repeat (STR) loci used in human
                    identity testing.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Maintained by:
                      </span>
                      <span className="font-medium">NIST</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Primary use:
                      </span>
                      <span className="font-medium">Human identification</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Data types:</span>
                      <span className="font-medium">
                        Population frequencies, sequences
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full bg-transparent"
                    asChild
                  >
                    <Link
                      href="https://strbase.nist.gov/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Visit STRBase
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <h3>Data Quality & Verification</h3>
                <CardDescription>
                  How we ensure data accuracy and reliability
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <CheckCircle className="h-6 w-6 text-primary" />
                    </div>
                    <h4 className="font-semibold mb-2">
                      Automated Verification
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      All marker data is automatically cross-referenced with
                      official STRBase records
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Download className="h-6 w-6 text-accent" />
                    </div>
                    <h4 className="font-semibold mb-2">Regular Updates</h4>
                    <p className="text-sm text-muted-foreground">
                      Daily synchronization ensures the latest STRBase data is
                      always available
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Database className="h-6 w-6 text-secondary" />
                    </div>
                    <h4 className="font-semibold mb-2">Data Integrity</h4>
                    <p className="text-sm text-muted-foreground">
                      Comprehensive validation checks maintain data quality and
                      consistency
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="features" className="space-y-6">
            <div className="grid gap-6">
              {integrationFeatures.map((feature, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <feature.icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-lg">{feature.title}</h3>
                          <CardDescription>
                            {feature.description}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className="bg-green-50 text-green-700 border-green-200"
                        >
                          {feature.coverage}
                        </Badge>
                        <Badge
                          variant={
                            feature.status === "active"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {feature.status === "active" ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="updates" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <h3>Recent Updates</h3>
                    <CardDescription>
                      Latest changes and additions to the STRBase integration
                    </CardDescription>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Search updates..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredUpdates.map((update, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-xs">
                              {update.type}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {update.date}
                            </span>
                          </div>
                          <p className="font-medium">{update.description}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-3">
                        {update.markers.map((marker, markerIndex) => (
                          <Badge
                            key={markerIndex}
                            variant="secondary"
                            className="text-xs"
                          >
                            {marker}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="api" className="space-y-6">
            <Card>
              <CardHeader>
                <h3>STRBase API Access</h3>
                <CardDescription>
                  Programmatic access to STRBase-integrated data for research
                  and development
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-muted/30 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Available Endpoints</h4>
                  <div className="space-y-2 text-sm font-mono">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        GET
                      </Badge>
                      <code>/api/strbase/markers</code>
                      <span className="text-muted-foreground">
                        - List all markers
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        GET
                      </Badge>
                      <code>/api/strbase/markers/{`{id}`}</code>
                      <span className="text-muted-foreground">
                        - Get marker details
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        GET
                      </Badge>
                      <code>/api/strbase/frequencies/{`{id}`}</code>
                      <span className="text-muted-foreground">
                        - Get population frequencies
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        GET
                      </Badge>
                      <code>/api/strbase/populations</code>
                      <span className="text-muted-foreground">
                        - List population groups
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-muted/30 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Example Response</h4>
                  <pre className="text-xs bg-background rounded p-3 overflow-x-auto">
                    {`{
  "marker": {
    "id": "fga",
    "name": "FGA",
    "fullName": "Fibrinogen Alpha Chain",
    "chromosome": "4",
    "motif": "TTTC",
    "nistVerified": true,
    "populationFrequencies": {
      "AFR": [
        {"allele": "18", "frequency": 0.08, "count": 80},
        {"allele": "19", "frequency": 0.15, "count": 150}
      ]
    }
  }
}`}
                  </pre>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    API Documentation
                  </Button>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download SDK
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
