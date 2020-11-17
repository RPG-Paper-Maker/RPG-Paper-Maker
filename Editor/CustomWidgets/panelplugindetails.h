/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef PANELPLUGINDETAILS_H
#define PANELPLUGINDETAILS_H

#include <QWidget>
#include <QTreeView>
#include "systemplugin.h"

// -------------------------------------------------------
//
//  CLASS PanelPluginDetails
//
//  The plugin details panel (where you can only edit parameters values).
//
// -------------------------------------------------------

namespace Ui {
class PanelPluginDetails;
}

class PanelPluginDetails : public QWidget
{
    Q_OBJECT

public:
    explicit PanelPluginDetails(QWidget *parent = nullptr);
    ~PanelPluginDetails();
    QTreeView * treeViewParameters() const;

    void initialize(SystemPlugin *plugin);
    void removeCurrentPlugin();

private:
    Ui::PanelPluginDetails *ui;
    SystemPlugin *m_plugin;
    SystemPlugin *m_currentPlugin;
};

#endif // PANELPLUGINDETAILS_H
