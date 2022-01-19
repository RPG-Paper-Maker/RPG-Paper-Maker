/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef PANELSONGS_H
#define PANELSONGS_H

#include <QWidget>
#include <QModelIndex>
#include <QStandardItemModel>
#include <QMediaPlayer>
#include <QSound>
#include <QTimer>
#include "superlistitem.h"
#include "systemsong.h"
#include "eventcommand.h"
#include "systemplaysong.h"

// -------------------------------------------------------
//
//  CLASS PanelSongs
//
//  Panel used for songs selection.
//
// -------------------------------------------------------

namespace Ui {
class PanelSongs;
}

class PanelSongs : public QWidget
{
    Q_OBJECT

public:
    explicit PanelSongs(QWidget *parent = nullptr);
    ~PanelSongs();

    SystemSong * song() const;
    void setSong(SystemSong *song);
    void setAreNegIDsEnabled(bool b);

    void initializePrimitives(QStandardItemModel *parameters, QStandardItemModel
        *properties);
    void setSongKind(SongKind kind);
    void changeSong(SystemSong *song);
    void initialize(EventCommand *command, int &i);
    void getCommand(QVector<QString> &command) const;
    void updatePlaySong(SystemPlaySong *song);
    void dropFiles(QStringList &files);

private:
    Ui::PanelSongs *ui;
    SongKind m_songKind;
    SystemSong *m_song;
    QMediaPlayer *m_mediaPlayerMusic, *m_mediaPlayerBackgroundSound,
                 *m_mediaPlayerSound, *m_mediaPlayerMusicEffect;
    QMediaPlayer *m_mediaPlayerMusicTemp, *m_mediaPlayerBackgroundSoundTemp,
                 *m_mediaPlayerSoundTemp, *m_mediaPlayerMusicEffectTemp;
    QMediaPlayer m_mediaPlayerMusic1, m_mediaPlayerBackgroundSound1,
                 m_mediaPlayerSound1, m_mediaPlayerMusicEffect1,
                 m_mediaPlayerMusic2, m_mediaPlayerBackgroundSound2,
                 m_mediaPlayerSound2, m_mediaPlayerMusicEffect2;
    QTimer m_timer;
    SystemSong *m_playedMusic, *m_playedBackgoundSound;
    bool m_needRestartMusic;
    QHash<SongKind, bool> m_startBool;
    QHash<SongKind, int> m_start;
    QHash<SongKind, bool> m_endBool;
    QHash<SongKind, int> m_end;
    bool m_areNegIDsEnabled;

    void showSongs(bool b);
    void updateSong(QStandardItem *item);
    void loadAvailableContent(int row = -1);
    void loadContentFromFolder(QString path, bool isBR = false, QString dlc = "");
    void deleteContent(QString path);
    void moveContent();
    void updateSongs();
    void updateVolume(int volume);
    void stopOnEnd(int end, qint64 pos, QMediaPlayer *player);
    void setVisibleStartEnd(bool b);
    void translate();

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
    void on_pushButtonDelete_clicked();
    void on_pushButtonAdd_clicked();
    void deletingContent(SuperListItem *super, int row);
    void on_treeViewAvailableContentDoubleClicked(QModelIndex);
    void on_widgetPanelIDPressEnter();
    void on_treeViewAvailableContentPressEnter();
    void on_checkBoxStart_toggled(bool checked);
    void on_checkBoxEnd_toggled(bool checked);
    void on_doubleSpinBoxStartValueChanged(double value);
    void on_doubleSpinBoxEndValueChanged(double value);
    void on_spinBoxVolumeValueChanged(int value);
    void on_horizontalSliderVolume_valueChanged(int value);
    void on_pushButtonPlay_clicked();
    void on_pushButtonStop_clicked();
    void on_pushButtonPause_clicked();
    void on_mediaStatusChanged(QMediaPlayer::MediaStatus);
    void on_mediaStatusBackgroundChanged(QMediaPlayer::MediaStatus);
    void on_mediaStatusMusicEffectChanged(QMediaPlayer::MediaStatus);
    void positionMusicChanged(qint64 pos);
    void positionBackgroundSoundChanged(qint64 pos);
    void positionSoundChanged(qint64 pos);
    void positionMusicEffectChanged(qint64 pos);
    void on_pushButtonDLC_clicked();
    void on_pushButtonExport_clicked();
};

#endif // PANELSONGS_H
