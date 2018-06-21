/*
    RPG Paper Maker Copyright (C) 2017 Marie Laporte

    This file is part of RPG Paper Maker.

    RPG Paper Maker is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    RPG Paper Maker is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Foobar.  If not, see <http://www.gnu.org/licenses/>.
*/

#ifndef PANELSONGS_H
#define PANELSONGS_H

#include <QWidget>
#include <QModelIndex>
#include <QStandardItemModel>
#include <QMediaPlayer>
#include <QSound>
#include <QTimer>
#include "songkind.h"
#include "superlistitem.h"
#include "systemsong.h"

namespace Ui {
class PanelSongs;
}

class PanelSongs : public QWidget
{
    Q_OBJECT

public:
    explicit PanelSongs(QWidget *parent = 0);
    ~PanelSongs();
    SystemSong* song() const;
    void setSong(SystemSong* song);
    void setSongKind(SongKind kind);
    void changeSong(SystemSong* song);

private:
    Ui::PanelSongs *ui;
    SongKind m_songKind;
    SystemSong* m_song;
    QMediaPlayer m_mediaPlayerMusic, m_mediaPlayerBackgroundSound,
                 m_mediaPlayerSound, m_mediaPlayerMusicEffect;
    QTimer m_timer;
    SystemSong* m_playedMusic, *m_playedBackgoundSound;
    bool m_needRestartMusic;

    void showSongs(bool b);
    void updateSong(QStandardItem* item);
    void loadAvailableContent(int row = -1);
    void loadContentFromFolder(QString path, bool isBR);
    void deleteContent(QString path);
    void moveContent();
    void updateSongs();
    void updateVolume(int volume);

public slots:
    void showAvailableContent(bool b);
    void play();
    void stop();
    void pause();
    void fadeOut();
    void pauseFromMusicEffect();

private slots:
    void on_listIDsIndexChanged(QModelIndex index, QModelIndex);
    void on_listIndexChanged(QModelIndex index, QModelIndex);
    void on_pushButtonMove_clicked();
    void on_pushButtonRefresh_clicked();
    void on_pushButtonAdd_clicked();
    void deletingContent(SuperListItem* super, int row);
    void on_treeViewAvailableContent_doubleClicked(QModelIndex);
    void on_widgetPanelIDsDoubleClicked(QModelIndex);
    void on_checkBoxStart_toggled(bool checked);
    void on_checkBoxEnd_toggled(bool checked);
    void on_spinBoxVolume_valueChanged(int value);
    void on_horizontalSliderVolume_valueChanged(int value);
    void on_pushButtonPlay_clicked();
    void on_pushButtonStop_clicked();
    void on_pushButtonPause_clicked();
    void on_mediaStatusChanged(QMediaPlayer::MediaStatus status);
    void on_mediaStatusBackgroundChanged(QMediaPlayer::MediaStatus status);
    void on_mediaStatusMusicEffectChanged(QMediaPlayer::MediaStatus status);
};

#endif // PANELSONGS_H
