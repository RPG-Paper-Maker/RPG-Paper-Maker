/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef PANELVIDEOS_H
#define PANELVIDEOS_H

#include <QWidget>
#include <QMediaPlayer>
#include "systemvideo.h"

// -------------------------------------------------------
//
//  CLASS PanelVideos
//
//  Panel used for videos selection.
//
// -------------------------------------------------------

namespace Ui {
class PanelVideos;
}

class PanelVideos : public QWidget
{
    Q_OBJECT

public:
    explicit PanelVideos(QWidget *parent = nullptr);
    ~PanelVideos();

    SuperListItem * video() const;
    void setVideo(SuperListItem *video);
    void setAreNegIDsEnabled(bool b);

    void setKind();
    void changeVideo(SuperListItem *video);
    void dropFiles(QStringList &files);

private:
    Ui::PanelVideos *ui;
    SuperListItem *m_video;
    bool m_areNegIDsEnabled;
    QMediaPlayer *m_player;
    bool m_isOutput;

    void updateVideo(QStandardItem *item);
    void loadAvailableContent(int row = -1);
    void loadContentFromFolder(QString path, bool isBR = false, QString dlc = "");
    void deleteContent(QString path);
    void moveContent();
    void updateVideos();
    void translate();

public slots:
    void showAvailableContent(bool b);

private slots:
    void on_listIDsIndexChanged(QModelIndex index, QModelIndex);
    void on_listIndexChanged(QModelIndex index, QModelIndex);
    void on_pushButtonMove_clicked();
    void on_pushButtonRefresh_clicked();
    void on_pushButtonDelete_clicked();
    void on_pushButtonAdd_clicked();
    void deletingContent(SuperListItem *super, int row);
    void on_treeViewAvailableContentDoubleClicked(QModelIndex);
    void on_pushButtonPlay_clicked();
    void on_pushButtonStop_clicked();
    void on_pushButtonPause_clicked();
    void on_pushButtonDLC_clicked();
    void on_pushButtonExport_clicked();
};

#endif // PANELVIDEOS_H
