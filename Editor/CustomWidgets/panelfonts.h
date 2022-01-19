/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef PANELFONTS_H
#define PANELFONTS_H

#include <QWidget>
#include "systemfont.h"

// -------------------------------------------------------
//
//  CLASS PanelFonts
//
//  Panel used for videos selection.
//
// -------------------------------------------------------

namespace Ui {
class PanelFonts;
}

class PanelFonts : public QWidget
{
    Q_OBJECT

public:
    explicit PanelFonts(QWidget *parent = nullptr);
    ~PanelFonts();

    SuperListItem * font() const;
    void setFont(SuperListItem *font);
    void setAreNegIDsEnabled(bool b);

    void setKind();
    void changeFont(SuperListItem *font);
    void dropFiles(QStringList &files);

private:
    Ui::PanelFonts *ui;
    SuperListItem *m_font;
    bool m_areNegIDsEnabled;

    void updateFont(QStandardItem *item);
    void loadAvailableContent(int row = -1);
    void loadContentFromFolder(QString path, bool isBR = false, QString dlc = "");
    void deleteContent(QString path);
    void moveContent();
    void updateFonts();
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
    void on_pushButtonDLC_clicked();
    void on_pushButtonExport_clicked();
};


#endif // PANELFONTS_H
