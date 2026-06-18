import { createSupabaseBrowserClient } from '../supabase/client';

export class StorageService {
  private readonly BUCKETS = {
    PLAYERS: 'player-photos',
    INVENTORY: 'inventory-images',
    ATTACHMENTS: 'request-attachments',
  };

  constructor(private readonly supabase: ReturnType<typeof createSupabaseBrowserClient>) {}

  async uploadPlayerPhoto(playerId: string, file: File): Promise<string> {
    const ext = file.name.split('.').pop();
    const path = `${playerId}/photo.${ext}`;

    const { error } = await this.supabase.storage
      .from(this.BUCKETS.PLAYERS)
      .upload(path, file, { upsert: true });

    if (error) throw new Error(error.message);

    const { data } = this.supabase.storage
      .from(this.BUCKETS.PLAYERS)
      .getPublicUrl(path);

    return data.publicUrl;
  }

  async uploadInventoryImage(itemId: string, file: File, index = 0): Promise<string> {
    const ext = file.name.split('.').pop();
    const path = `${itemId}/${index}.${ext}`;

    const { error } = await this.supabase.storage
      .from(this.BUCKETS.INVENTORY)
      .upload(path, file, { upsert: true });

    if (error) throw new Error(error.message);

    const { data } = this.supabase.storage
      .from(this.BUCKETS.INVENTORY)
      .getPublicUrl(path);

    return data.publicUrl;
  }

  async uploadAttachment(requestId: string, file: File): Promise<string> {
    const path = `${requestId}/${Date.now()}-${file.name}`;

    const { error } = await this.supabase.storage
      .from(this.BUCKETS.ATTACHMENTS)
      .upload(path, file);

    if (error) throw new Error(error.message);

    const { data } = this.supabase.storage
      .from(this.BUCKETS.ATTACHMENTS)
      .getPublicUrl(path);

    return data.publicUrl;
  }

  async deleteFile(bucket: string, path: string): Promise<void> {
    const { error } = await this.supabase.storage
      .from(bucket)
      .remove([path]);

    if (error) throw new Error(error.message);
  }
}
