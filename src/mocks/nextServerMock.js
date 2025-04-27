/**
 * Mock implementation of Next.js server module
 * This is used to prevent errors when importing from next/server
 */

// Create a mock NextResponse class
class NextResponse {
  constructor(body, init = {}) {
    this.body = body;
    this.init = init;
    this.status = init.status || 200;
    this.headers = init.headers || new Headers();
  }

  static json(data, init = {}) {
    return new NextResponse(JSON.stringify(data), {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...init.headers,
      },
    });
  }

  static text(text, init = {}) {
    return new NextResponse(text, {
      ...init,
      headers: {
        'Content-Type': 'text/plain',
        ...init.headers,
      },
    });
  }
}

export { NextResponse }; 