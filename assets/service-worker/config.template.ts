{{- $homepage := "/" }}
{{- $langs := slice }}
{{- $fallbacks := slice }}

{{- $paths := slice "/manifest.json" }}
{{- $pages := slice "/offline" }}
{{- range $site := $.Sites }}
  {{- if eq $homepage "/" }}{{ with $site.GetPage "/" }}{{ $homepage = .Permalink }}{{ end }}{{ end }}
  {{- $langs = $langs | append $site.Language.Lang }}
  {{- range $pages }}
    {{- with $site.GetPage . }}{{- $fallbacks = $fallbacks | append .Permalink }}{{ end }}
  {{- end }}
  {{ range $paths }}
    {{- $fallbacks = $fallbacks | append ((printf "%s%s" (strings.TrimPrefix "/" $site.LanguagePrefix) .) | absURL ) }}
  {{- end }}
{{- end }}

{{- $fallbackImage := "images/offline.png" }}
{{- $fallbacks =  $fallbacks | append (resources.Get $fallbackImage).Permalink }}

{{- $precache := default dict .Site.Params.pwa.precache }}
const precache = JSON.parse('{{ $precache | jsonify }}');

const config = {
  env: '{{ hugo.Environment }}',
  baseURL: '{{ $.Site.BaseURL }}',
  homepage: '{{ $homepage }}',
  langs: JSON.parse('{{ $langs | jsonify }}'),
  fallbacks: JSON.parse('{{ $fallbacks | jsonify }}'),
  fallbacksCacheName: 'fallbacks',
  fallbacksImage: '{{ $fallbackImage }}',
  fonts: precache.fonts ? precache.fonts : [],
  fontsCacheName: 'fonts',
  images: precache.images ? precache.images : [],
  imagesCacheName: 'images',
  pages: precache.pages ? precache.pages : [],
  pagesCacheName: 'pages',
  scripts:precache.scripts ? precache.scripts : [],
  scriptsCacheName: 'scripts',
  styles: precache.styles ? precache.styles : [],
  stylesCacheName: 'styles',
}
console.debug('service worker config:', config);
